"use client";

import { useContext, useState } from "react";
import { FormLogoContext, FormLogoState } from "./FormLogoContext";
import FormLogoName from "./FormLogoName";
import FormLogoColors from "./FormLogoColors";
import FormLogoStyles from "./FormLogoStyles";
import { FormLogoResult } from "./FormLogoResult";

const FormStateComponent = () => {
	const formLogoContext = useContext(FormLogoContext);
	switch (formLogoContext.step) {
		case "name":
			return <FormLogoName />;
		case "colors":
			return <FormLogoColors />;
		case "styles":
			return <FormLogoStyles />;
		case "generating":
			return <FormLogoResult />;
		default:
			return <></>;
	}
};

export default function FormLogo() {
	const [state, setState] = useState<FormLogoState>({
		step: "name",
		values: {
			name: "",
			slogan: "",
			colors: [],
			styles: [],
		},
		setState: () => {},
	});

	return (
		<FormLogoContext.Provider
			value={{
				...state,
				setState: (partial) => {
					setState((prev) => ({ ...prev, ...partial }));
				},
			}}
		>
			<main className="w-full max-w-7xl mx-auto px-4 py-24 h-screen">
				<FormStateComponent />
			</main>
		</FormLogoContext.Provider>
	);
}
