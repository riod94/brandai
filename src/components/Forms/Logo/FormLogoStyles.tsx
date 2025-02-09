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
	styles: v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(3)),
});

type FormSchemaType = v.InferInput<typeof formSchema>;

type ColorItem = {
	label: string;
	value: string;
	src: string;
	className: string;
	isDisabled: boolean;
};

const defaultStyles: ColorItem[] = [
	{
		label: "Abstract",
		value: "Abstract",
		src: "/images/styles/abstract.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Cartoon",
		value: "Cartoon",
		src: "/images/styles/cartoon.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Classic",
		value: "Classic",
		src: "/images/styles/classic.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Corporate",
		value: "Corporate",
		src: "/images/styles/corporate.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Emblem",
		value: "Emblem",
		src: "/images/styles/emblem.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Mascot",
		value: "Mascot",
		src: "/images/styles/mascot.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Vintage",
		value: "Vintage",
		src: "/images/styles/vintage.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
	{
		label: "Wordmark",
		value: "Wordmark",
		src: "/images/styles/wordmark.png",
		className: "rounded-lg text-black",
		isDisabled: false,
	},
];

export default function FormLogoStyles() {
	const [styles, setStyles] = useState(defaultStyles);
	const formLogoCtx = useContext(FormLogoContext);
	const [state, setState] = useState<FormSchemaType>({
		styles: formLogoCtx.values.styles,
	});

	function handleOnCheckboxChange(value: string[]) {
		setState((prev) => ({ ...prev, styles: value }));
		if (value.length == 3) {
			// Set isDisabled to true except the 3 selected styles
			const updateStyles = styles.map((style) => {
				return {
					...style,
					isDisabled: !value.includes(style.value),
				};
			});
			setStyles(updateStyles);
		} else {
			setStyles(defaultStyles);
		}
	}

	function handleGoBack() {
		formLogoCtx.setState({
			step: "colors",
			values: {
				...formLogoCtx.values,
				styles: state.styles,
			},
		});
	}

	function handleOnSubmit() {
		formLogoCtx.setState({
			step: "generating",
			values: {
				...formLogoCtx.values,
				styles: state.styles,
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
					Select Styles
				</h1>
				<p className="mb-4">
					We'll use these styles as inspiration to create your logo
				</p>
			</CardHeader>
			<CardBody className="p-6">
				<Form onSubmit={handleOnSubmit}>
					<div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
						<CheckBoxGroup
							items={styles}
                            selected={state.styles}
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
							isDisabled={state.styles.length === 0}
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
