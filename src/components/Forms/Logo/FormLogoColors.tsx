"use client";

import * as v from "valibot";
import { useContext, useState } from "react";
import { FormLogoContext } from "./FormLogoContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import CheckBoxGroup from "@/components/UI/CheckBoxGroup";

const formSchema = v.object({
	colors: v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(3)),
});

type FormSchemaType = v.InferInput<typeof formSchema>;

type ColorItem = {
	label: string;
	value: string;
	className: string;
	isDisabled: boolean;
};

const defaultColors: ColorItem[] = [
	{
		label: "Red",
		value: "Red",
		className: "rounded-full text-black bg-red-500",
		isDisabled: false,
	},
	{
		label: "Orange",
		value: "Orange",
		className: "rounded-full text-black bg-orange-500",
		isDisabled: false,
	},
	{
		label: "Yellow",
		value: "Yellow",
		className: "rounded-full text-black bg-yellow-500",
		isDisabled: false,
	},
	{
		label: "Green",
		value: "Green",
		className: "rounded-full text-black bg-green-500",
		isDisabled: false,
	},
	{
		label: "Cyan",
		value: "Cyan",
		className: "rounded-full text-black bg-cyan-500",
		isDisabled: false,
	},
	{
		label: "Blue",
		value: "Blue",
		className: "rounded-full text-black bg-blue-500",
		isDisabled: false,
	},
	{
		label: "Indigo",
		value: "Indigo",
		className: "rounded-full text-white bg-indigo-500",
		isDisabled: false,
	},
	{
		label: "Purple",
		value: "Purple",
		className: "rounded-full text-white bg-purple-500",
		isDisabled: false,
	},
	{
		label: "Pink",
		value: "Pink",
		className: "rounded-full text-black bg-pink-500",
		isDisabled: false,
	},
	{
		label: "Rose",
		value: "Rose",
		className: "rounded-full text-black bg-rose-500",
		isDisabled: false,
	},
	{
		label: "Brown",
		value: "Brown",
		className: "rounded-full text-white bg-stone-500",
		isDisabled: false,
	},
	{
		label: "White",
		value: "White",
		className: "rounded-full text-black bg-white",
		isDisabled: false,
	},
	{
		label: "Black",
		value: "Black",
		className: "rounded-full text-white bg-black",
		isDisabled: false,
	},
	{
		label: "Gray",
		value: "Gray",
		className: "rounded-full text-white bg-gray-500",
		isDisabled: false,
	},
];

export default function FormLogoColors() {
	const [colors, setColors] = useState(defaultColors);
	const formLogoCtx = useContext(FormLogoContext);
	const [state, setState] = useState<FormSchemaType>({
		colors: formLogoCtx.values.colors,
	});

	function handleOnCheckboxChange(value: string[]) {
		setState((prev) => ({ ...prev, colors: value }));
		if (value.length == 3) {
			// Set isDisabled to true except the 3 selected colors
			const updateColors = colors.map((color) => {
				return {
					...color,
					isDisabled: !value.includes(color.value),
				};
			});
			setColors(updateColors);
		} else {
			setColors(defaultColors);
		}
	}

	function handleGoBack() {
		formLogoCtx.setState({
			step: "name",
			values: {
				...formLogoCtx.values,
				colors: state.colors,
			},
		});
	}

	function handleOnSubmit() {
		formLogoCtx.setState({
			step: "styles",
			values: {
				...formLogoCtx.values,
				colors: state.colors,
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
					Select Colors
				</h1>
				<p className="mb-4">
					Choose colors that highlight your business strengths
				</p>
			</CardHeader>
			<CardBody className="p-6">
				<Form onSubmit={handleOnSubmit}>
					<div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
						<CheckBoxGroup
							items={colors}
							selected={state.colors}
							onCheckboxChange={handleOnCheckboxChange}
						/>
					</div>
					<div className="flex justify-end w-full gap-2">
						<Button
							radius="full"
							variant="shadow"
							className="w-full sm:w-auto"
							onPress={handleGoBack}
							startContent={<ArrowLeft />}
						>
							Back
						</Button>
						<Button
							radius="full"
							variant="shadow"
							color="primary"
							type="submit"
							isDisabled={state.colors.length === 0}
							endContent={<ArrowRight />}
						>
							Continue
						</Button>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
}
