"use client";

import { createContext } from "react";
import { FormLogoValues } from "@/types";

export type FormLogoStepName =
    | "name"
    | "colors"
    | "styles"
    | "generating";

export type FormLogoState = {
    step: FormLogoStepName;
    values: FormLogoValues;
    setState: (partial: Partial<FormLogoState>) => void;
};

export const FormLogoContext = createContext<FormLogoState>({
    step: "name",
    values: {
        name: "",
        slogan: "",
        colors: [],
        styles: [],
    },
    setState: () => { },
});