import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQuery() {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
}
