import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Download, ImageOff, RotateCw } from "lucide-react";
import { FormLogoContext } from "./FormLogoContext";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import useSWR from "swr";

type State = {
	imgSrc: string | null;
};

export const LoadingState = () => {
	return (
		<div className="flex flex-col place-items-center gap-6 p-8">
			<Skeleton className="size-60 sm:size-96 rounded-lg" />
			<p className="font-semibold text-xl">Generating your logo...</p>
		</div>
	);
};

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
	return (
		<div className="flex flex-col place-items-center gap-6 py-16">
			<ImageOff className="size-44 sm:size-72 rounded-lg" />
			<p className="font-semibold text-xl">Failed generating your logo</p>
			<Button
				variant="shadow"
				color="secondary"
				className="font-semibold"
				onPress={onRetry}
				size="lg"
			>
				<RotateCw />
				RETRY
			</Button>
		</div>
	);
};

export const SuccessState = ({
	imgSrc,
	onRetry,
}: {
	imgSrc: string;
	onRetry: () => void;
}) => {
	const { values } = useContext(FormLogoContext);
	return (
		<div className="flex flex-col place-items-center gap-6 py-8">
			<h2 className="font-semibold text-xl">
				Here is logo for &quot;{values.name}&quot;{" "}
				{values.slogan && ` with slogan "${values.slogan}"`}
			</h2>
			<Image
				src={imgSrc}
				alt={values.name}
				width={0}
				height={0}
				className="size-60 sm:size-96 rounded-lg border-2 border-default-200"
			/>
			<div className="flex flex-row gap-4">
				<Link href={imgSrc} download={`${values.name}.png`} target="_blank">
					<Button
						variant="shadow"
						color="success"
						className="font-semibold"
						size="lg"
						startContent={<Download />}
					>
						Download
					</Button>
				</Link>
				<Button
					variant="shadow"
					color="secondary"
					className="font-semibold"
					onPress={() => onRetry()}
					size="lg"
				>
					<RotateCw />
					RETRY
				</Button>
			</div>
		</div>
	);
};

export const FormLogoResult = () => {
	const { values } = useContext(FormLogoContext);
	const url = `/api/generate/logo`;
	const fetcher = (url: string) =>
		fetch(url, {
			method: "POST",
			body: JSON.stringify(values),
		}).then((res) => res.json());

	const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	});

	return (
		<Card
			radius="lg"
			shadow="lg"
			className="w-full max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900"
		>
			<CardBody className="p-6">
				{isLoading && <LoadingState />}
				{error && <ErrorState onRetry={mutate} />}
				{data?.imgSrc && !isLoading && !error && (
					<SuccessState imgSrc={data.imgSrc} onRetry={mutate} />
				)}
			</CardBody>
		</Card>
	);
};
