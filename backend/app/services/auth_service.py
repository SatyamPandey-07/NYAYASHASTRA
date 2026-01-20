"""
NyayGuru AI Pro - Authentication Service
Handles verification of Clerk JWT tokens.
"""

import logging
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from jose import jwt, JWTError

from app.config import settings

logger = logging.getLogger(__name__)

# Security scheme
security = HTTPBearer()

# Clerk configuration
CLERK_ISSUER = "https://apparent-trout-50.clerk.accounts.dev"
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

# Cached JWKS
_jwks: Optional[Dict[str, Any]] = None


async def get_jwks() -> Dict[str, Any]:
    """Get Clerk JWKS (with caching)."""
    global _jwks
    if _jwks is None:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(CLERK_JWKS_URL)
                _jwks = response.json()
                logger.info("Successfully fetched Clerk JWKS")
        except Exception as e:
            logger.error(f"Failed to fetch Clerk JWKS: {e}")
            raise HTTPException(status_code=500, detail="Authentication configuration error")
    return _jwks


async def verify_token_optional(request: Request) -> Optional[Dict[str, Any]]:
    """Optionally verify the Clerk JWT token. Returns None if no token provided."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None  # No token - allow anonymous access
    
    token = auth_header.split(" ")[1]
    jwks = await get_jwks()
    
    try:
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=None,
            issuer=CLERK_ISSUER
        )
        return payload
    except (JWTError, Exception) as e:
        logger.warning(f"Token verification failed (allowing anonymous): {e}")
        return None


async def get_current_user_optional(request: Request) -> Dict[str, Any]:
    """Dependency to get the current user or anonymous user."""
    payload = await verify_token_optional(request)
    
    if payload:
        user_id = payload.get("sub")
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "role": payload.get("role", "user")
        }
    
    # Return anonymous user
    return {
        "user_id": None,
        "email": None,
        "role": "anonymous"
    }


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Verify the Clerk JWT token."""
    token = credentials.credentials
    jwks = await get_jwks()
    
    try:
        # Decode the token (verification happens here)
        # Note: In a production app, you should use the public key from JWKS to verify
        # For simplicity in this dev environment, we'll verify based on the issuer
        # and ignore the full RSA verification unless requested, as it requires more complex jose usage.
        
        # A more complete implementation would use the jwks to find the key id and verify the signature.
        # But Clerk's JWT can often be validated via their SDK or simple JWT checks if the issuer is trusted.
        
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=None, # Clerk doesn't always include aud in test tokens
            issuer=CLERK_ISSUER
        )
        
        return payload
        
    except JWTError as e:
        logger.error(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")


async def get_current_user(payload: Dict[str, Any] = Depends(verify_token)) -> Dict[str, Any]:
    """Dependency to get the current authenticated user from the token payload."""
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    return {
        "user_id": user_id,
        "email": payload.get("email"),
        "role": payload.get("role", "user")
    }
