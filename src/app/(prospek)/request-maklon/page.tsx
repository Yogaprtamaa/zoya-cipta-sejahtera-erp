"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequestMaklonRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/maklon"); }, [router]);
  return null;
}
