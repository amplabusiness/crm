import os
import functools
from typing import Callable, Any, Optional

from flask import request, jsonify
import jwt


SUPABASE_JWT_SECRET_ENV = "SUPABASE_JWT_SECRET"


def _get_supabase_secret() -> Optional[str]:
    secret = os.environ.get(SUPABASE_JWT_SECRET_ENV)
    return secret


def require_auth(view: Callable[..., Any]) -> Callable[..., Any]:
    """
    Decorator that validates Bearer JWT using Supabase project's JWT secret (HS256).
    If SUPABASE_JWT_SECRET is not configured, the endpoint will return 401 instructing to provide it.
    """

    @functools.wraps(view)
    def wrapped(*args: Any, **kwargs: Any):
        secret = _get_supabase_secret()
        if not secret:
            return (
                jsonify(
                    {
                        "ok": False,
                        "error": "missing_supabase_secret",
                        "message": "Set SUPABASE_JWT_SECRET to enable authorization",
                    }
                ),
                401,
            )

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"ok": False, "error": "missing_token"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            jwt.decode(token, secret, algorithms=["HS256"])
        except jwt.PyJWTError as e:  # noqa: PERF203
            return jsonify({"ok": False, "error": "invalid_token", "detail": str(e)}), 401
        return view(*args, **kwargs)

    return wrapped
