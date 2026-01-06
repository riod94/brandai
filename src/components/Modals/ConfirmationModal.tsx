"use client";
import React, { ReactNode } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import {
	AlertTriangle,
	CheckCircle,
	Info,
	Trash2,
	XCircle,
} from "lucide-react";

type ModalColor =
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger"
	| "default";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	isLoading?: boolean;
	icon?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	color?: ModalColor;
}

const colorStyles: Record<
	ModalColor,
	{ bg: string; shadow: string; icon: string }
> = {
	primary: {
		bg: "from-blue-500 to-indigo-600",
		shadow: "shadow-blue-500/30",
		icon: "text-white",
	},
	secondary: {
		bg: "from-purple-500 to-pink-600",
		shadow: "shadow-purple-500/30",
		icon: "text-white",
	},
	success: {
		bg: "from-green-500 to-emerald-600",
		shadow: "shadow-green-500/30",
		icon: "text-white",
	},
	warning: {
		bg: "from-orange-500 to-amber-600",
		shadow: "shadow-orange-500/30",
		icon: "text-white",
	},
	danger: {
		bg: "from-red-500 to-rose-600",
		shadow: "shadow-red-500/30",
		icon: "text-white",
	},
	default: {
		bg: "from-gray-500 to-gray-600",
		shadow: "shadow-gray-500/30",
		icon: "text-white",
	},
};

const getDefaultIcon = (color: ModalColor) => {
	switch (color) {
		case "danger":
			return <Trash2 className="w-8 h-8 text-white" />;
		case "warning":
			return <AlertTriangle className="w-8 h-8 text-white" />;
		case "success":
			return <CheckCircle className="w-8 h-8 text-white" />;
		default:
			return <Info className="w-8 h-8 text-white" />;
	}
};

export default function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	isLoading = false,
	icon,
	confirmText = "Confirm",
	cancelText = "Cancel",
	color = "primary",
}: ConfirmationModalProps) {
	const styles = colorStyles[color];
	const displayIcon = icon || getDefaultIcon(color);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			placement="center"
			hideCloseButton={true}
			backdrop="blur"
			classNames={{
				base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
			}}
		>
			<ModalContent>
				<ModalBody className="pt-8 pb-6 px-8">
					<div className="flex flex-col items-center text-center">
						{/* Icon with dynamic gradient background */}
						<div
							className={`w-16 h-16 rounded-full bg-gradient-to-br ${styles.bg} flex items-center justify-center mb-5 shadow-lg ${styles.shadow} transform transition-transform duration-500 hover:scale-110`}
						>
							{displayIcon}
						</div>

						{/* Title */}
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							{title}
						</h3>

						{/* Description */}
						<p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
							{description}
						</p>
					</div>
				</ModalBody>
				<ModalFooter className="flex justify-center gap-3 pb-8">
					<Button
						variant="flat"
						radius="full"
						size="lg"
						className="px-8 font-medium"
						onPress={onClose}
						isDisabled={isLoading}
					>
						{cancelText}
					</Button>
					<Button
						color={color}
						radius="full"
						size="lg"
						className={`px-8 font-medium bg-gradient-to-r ${styles.bg} shadow-lg ${styles.shadow}`}
						onPress={onConfirm}
						isLoading={isLoading}
					>
						{confirmText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
