"use client";
import { useState, useRef, useEffect } from "react";
import {
	Stage,
	Layer,
	Image as KonvaImage,
	Text,
	Transformer,
} from "react-konva";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Download, Type, Palette } from "lucide-react";
import Konva from "konva";

interface LogoEditorProps {
	imageUrl: string;
	logoName: string;
	onClose?: () => void;
}

export default function LogoEditor({
	imageUrl,
	logoName,
	onClose,
}: LogoEditorProps) {
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [text, setText] = useState(logoName);
	const [textColor, setTextColor] = useState("#000000");
	const [fontSize, setFontSize] = useState(48);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const stageRef = useRef<Konva.Stage>(null);
	const textRef = useRef<Konva.Text>(null);
	const transformerRef = useRef<Konva.Transformer>(null);

	// Load image
	useEffect(() => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.src = imageUrl;
		img.onload = () => {
			setImage(img);
		};
	}, [imageUrl]);

	// Update transformer when text is selected
	useEffect(() => {
		if (selectedId && transformerRef.current && textRef.current) {
			transformerRef.current.nodes([textRef.current]);
			transformerRef.current.getLayer()?.batchDraw();
		}
	}, [selectedId]);

	const handleDownload = () => {
		if (!stageRef.current) return;

		// Deselect before export
		setSelectedId(null);
		transformerRef.current?.nodes([]);

		const uri = stageRef.current.toDataURL({
			pixelRatio: 3, // High quality
		});

		const link = document.createElement("a");
		link.download = `${logoName
			.toLowerCase()
			.replace(/\s+/g, "-")}-edited.png`;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const canvasSize = 600;

	return (
		<div className="space-y-6">
			{/* Canvas */}
			<Card>
				<CardBody className="p-4 flex justify-center bg-checkered">
					<Stage
						width={canvasSize}
						height={canvasSize}
						ref={stageRef}
						onClick={(e) => {
							// Deselect when clicking on empty area
							const clickedOnEmpty = e.target === e.target.getStage();
							if (clickedOnEmpty) {
								setSelectedId(null);
							}
						}}
					>
						<Layer>
							{/* Background Logo */}
							{image && (
								<KonvaImage
									image={image}
									x={0}
									y={0}
									width={canvasSize}
									height={canvasSize}
								/>
							)}

							{/* Editable Text */}
							<Text
								ref={textRef}
								text={text}
								x={canvasSize / 2}
								y={canvasSize - 100}
								fontSize={fontSize}
								fill={textColor}
								fontFamily="Arial, sans-serif"
								fontStyle="bold"
								align="center"
								offsetX={
									textRef.current?.width()
										? textRef.current.width() / 2
										: 0
								}
								draggable
								onClick={() => setSelectedId("text")}
								onTap={() => setSelectedId("text")}
							/>

							{/* Transformer for text */}
							{selectedId && <Transformer ref={transformerRef} />}
						</Layer>
					</Stage>
				</CardBody>
			</Card>

			{/* Controls */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardBody className="p-4 space-y-3">
						<div className="flex items-center gap-2">
							<Type className="w-5 h-5" />
							<h3 className="font-semibold">Text</h3>
						</div>
						<Input
							label="Text Content"
							value={text}
							onChange={(e) => setText(e.target.value)}
							variant="bordered"
						/>
						<Input
							label="Font Size"
							type="number"
							value={fontSize.toString()}
							onChange={(e) =>
								setFontSize(parseInt(e.target.value) || 48)
							}
							variant="bordered"
							min="12"
							max="200"
						/>
					</CardBody>
				</Card>

				<Card>
					<CardBody className="p-4 space-y-3">
						<div className="flex items-center gap-2">
							<Palette className="w-5 h-5" />
							<h3 className="font-semibold">Color</h3>
						</div>
						<div className="flex items-center gap-3">
							<input
								type="color"
								value={textColor}
								onChange={(e) => setTextColor(e.target.value)}
								className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
							/>
							<Input
								label="Hex Color"
								value={textColor}
								onChange={(e) => setTextColor(e.target.value)}
								variant="bordered"
								placeholder="#000000"
							/>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Actions */}
			<div className="flex gap-3 justify-end">
				{onClose && (
					<Button variant="flat" onPress={onClose}>
						Cancel
					</Button>
				)}
				<Button
					color="primary"
					startContent={<Download className="w-5 h-5" />}
					onPress={handleDownload}
				>
					Download Edited Logo
				</Button>
			</div>

			<style jsx global>{`
				.bg-checkered {
					background-image: linear-gradient(
							45deg,
							#e5e5e5 25%,
							transparent 25%
						),
						linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
						linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
					background-size: 20px 20px;
					background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
				}
			`}</style>
		</div>
	);
}
