from typing import Any, Dict, Optional
import httpx


async def get_json(url: str, timeout: float = 10.0, headers: Optional[Dict[str, str]] = None) -> Any:
    async with httpx.AsyncClient(timeout=timeout, headers=headers) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()
