"use client";

import * as v from "valibot";
import { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormLogoContext } from "./FormLogoContext";
import { ArrowRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const formSchema = v.object({
	name: v.pipe(
		v.string("Name is required"),
		v.minLength(3, "Name must be at least 3 characters")
	),
	slogan: v.optional(v.string()),
});

type FormSchemaType = v.InferInput<typeof formSchema>;

export default function FormLogoName() {
	const params = useSearchParams();
	const logoName = params.get("logoName");
	const formLogoCtx = useContext(FormLogoContext);
	const [state, setState] = useState<FormSchemaType>({
		name: logoName || formLogoCtx.values.name,
		slogan: formLogoCtx.values.slogan,
	});

	function handleOnSubmit() {
		formLogoCtx.setState({
			step: "colors",
			values: {
				...formLogoCtx.values,
				name: state.name,
				slogan: state.slogan,
			},
		});
	}

	return (
		<Card
			radius="lg"
			shadow="lg"
			className="w-full max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900"
		>
			<CardHeader className="flex flex-col items-center justify-center">
				<h1 className="text-4xl font-black leading-tight bg-gradient-to-r from-primary/80 to-secondary/80 dark:from-primary/95 dark:to-secondary/95 inline-block text-transparent bg-clip-text">
					Logo Name
				</h1>
				<p className="mb-4">Enter your logo name</p>
			</CardHeader>
			<CardBody className="p-6">
				<Form onSubmit={handleOnSubmit}>
					<div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
						<Input
							type="text"
							radius="full"
							variant="flat"
							size="lg"
							color="primary"
							name="logoName"
							value={state.name}
							placeholder="Enter your company name"
							onChange={(e) =>
								setState({ ...state, name: e.target.value })
							}
						/>
						<Input
							type="text"
							radius="full"
							variant="flat"
							size="lg"
							color="secondary"
							name="logoSlogan"
							placeholder="Slogan (Optional)"
							className="w-full flex"
							onChange={(e) =>
								setState({ ...state, slogan: e.target.value })
							}
						/>
					</div>
					<div className="flex justify-end w-full">
						<Button
							radius="full"
							variant="shadow"
							color="primary"
							type="submit"
							isDisabled={!state.name}
						>
							Continue
							<ArrowRight />
						</Button>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
}
