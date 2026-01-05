import * as v from 'valibot';

// Schema untuk form logo generation
export const FormLogoSchema = v.object({
    name: v.pipe(
        v.string(),
        v.minLength(1, 'Name is required'),
        v.maxLength(100, 'Name must be less than 100 characters')
    ),
    slogan: v.optional(
        v.pipe(
            v.string(),
            v.maxLength(200, 'Slogan must be less than 200 characters')
        )
    ),
    colors: v.array(v.string()),
    styles: v.array(v.string()),
});

export type FormLogoInput = v.InferInput<typeof FormLogoSchema>;

// Helper function untuk validasi
export const validateFormLogo = (data: unknown) => {
    return v.safeParse(FormLogoSchema, data);
};
