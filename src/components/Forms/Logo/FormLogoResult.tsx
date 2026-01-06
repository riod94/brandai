import Image from "next/image";
import { useContext, useEffect } from "react";
import { ImageOff, RotateCw, Sparkles } from "lucide-react";
import { FormLogoContext } from "./FormLogoContext";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export const LoadingState = () => {
	return (
		<div className="flex flex-col place-items-center gap-6 py-16">
			<div className="relative">
				<Skeleton className="size-64 sm:size-80 rounded-2xl" />
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
						<Sparkles className="w-8 h-8 text-white animate-spin" />
					</div>
				</div>
			</div>
			<div className="text-center">
				<p className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
					Creating your logo...
				</p>
				<p className="text-gray-500 mt-2">This may take a few seconds</p>
			</div>
		</div>
	);
};

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
	return (
		<div className="flex flex-col place-items-center gap-6 py-16">
			<div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
				<ImageOff className="w-16 h-16 text-red-500" />
			</div>
			<div className="text-center">
				<p className="font-bold text-2xl mb-2">Generation Failed</p>
				<p className="text-gray-500 mb-6">
					Something went wrong. Please try again.
				</p>
			</div>
			<Button
				variant="shadow"
				color="primary"
				className="font-semibold bg-gradient-to-r from-primary to-secondary"
				onPress={onRetry}
				size="lg"
				radius="full"
				startContent={<RotateCw className="w-5 h-5" />}
			>
				Try Again (1 Credit)
			</Button>
			<p className="text-xs text-amber-600 dark:text-amber-400">
				⚠️ Retry will use 1 credit
			</p>
		</div>
	);
};

export const FormLogoResult = () => {
	const { values } = useContext(FormLogoContext);
	const router = useRouter();
	const url = `/api/generate/logo`;

	const fetcher = (url: string) =>
		fetch(url, {
			method: "POST",
			body: JSON.stringify(values),
		}).then((res) => res.json());

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		url,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateIfStale: false,
			revalidateOnReconnect: false,
		}
	);

	const isGenerating = isLoading || isValidating;

	// Redirect to detail page after successful generation
	useEffect(() => {
		if (data?.logoId && !isGenerating && !error) {
			router.push(`/app/logo/${data.logoId}`);
		}
	}, [data, isGenerating, error, router]);

	return (
		<Card
			radius="lg"
			shadow="lg"
			className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900"
		>
			<CardBody className="p-8">
				{isGenerating && <LoadingState />}
				{error && !isGenerating && <ErrorState onRetry={() => mutate()} />}
				{data?.imgSrc && !isGenerating && !error && (
					<div className="flex flex-col place-items-center gap-6 py-8">
						<div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-bounce">
							<Sparkles className="w-8 h-8 text-green-500" />
						</div>
						<p className="font-bold text-xl">
							Logo created! Redirecting...
						</p>
					</div>
				)}
			</CardBody>
		</Card>
	);
};
