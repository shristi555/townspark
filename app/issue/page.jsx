"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IssuePage() {
	const router = useRouter();

	useEffect(() => {
		// For demo purposes, redirect to the public issues page
		router.replace("/issue/list");
	}, [router]);

	return <></>;
}
