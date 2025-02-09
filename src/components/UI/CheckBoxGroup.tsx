import React from "react";
import {
	CheckboxGroup,
	Checkbox,
	CheckboxGroupProps,
	CheckboxProps,
	Image,
} from "@heroui/react";

interface CustomCheckboxProps extends CheckboxProps {
	label?: string;
	className?: string;
	isDisabled?: boolean;
}

export const CustomCheckbox = (props: CustomCheckboxProps) => {
	const className = props?.className ?? "";

	return (
		<Checkbox
			aria-label={props?.label}
			classNames={{
				base: `inline-flex w-sm bg-content1 m-0 items-center justify-start cursor-pointer rounded-lg gap-2 py-2 px-4 border-2 border-default-200 data-[selected=true]:border-primary ${className}`,
				label: "w-full",
			}}
			value={props?.value}
			isDisabled={props?.isDisabled}
		>
			{props.src ? (
				<Image
					src={props.src}
					width="100%"
					height={100}
					alt={props?.label}
				/>
			) : (
				props?.children
			)}
		</Checkbox>
	);
};

export default function CheckBoxGroup({
	items,
	selected,
	onCheckboxChange,
	...props
}: {
	items: {
		label: string;
		value: string;
		src?: string;
		className?: string;
		isDisabled?: boolean;
	}[];
	selected?: string[];
	onCheckboxChange?: (value: string[]) => void;
	props?: CheckboxGroupProps;
}) {
	const [groupSelected, setGroupSelected] = React.useState<string[]>(
		selected ?? []
	);

	const handleOnChange = (value: string[]) => {
		setGroupSelected(value);
		onCheckboxChange?.(value);
	};

	return (
		<div className="flex flex-col gap-1 w-full">
			<CheckboxGroup
				{...props}
				className="gap-2"
				orientation="horizontal"
				value={groupSelected}
				onChange={(value) => handleOnChange(value)}
			>
				{items.map((item) => (
					<CustomCheckbox
						key={item.value}
						value={item.value}
						className={item.className}
						src={item.src}
						isDisabled={item.isDisabled}
					>
						{item.label}
					</CustomCheckbox>
				))}
			</CheckboxGroup>
		</div>
	);
}
