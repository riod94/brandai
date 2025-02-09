import { generateLogo } from "@/services/generateLogo";
import { FormLogoValues } from "@/types";
// import { storeLogo } from "@/services/store-logo";

export const maxDuration = 60;

export async function POST(request: Request) {
    const payload: FormLogoValues = await request.json();
    // const { userId } = await auth();
    try {
        const result = await generateLogo(payload);
        // await storeLogo({
        //     userId: userId!,
        //     name: payload.name,
        //     description: payload.description,
        //     image: result,
        // });
        return Response.json({ imgSrc: result });
    } catch (e) {
        console.error("failed generate logo:", e);
        return new Response(null, { status: 500 });
    }
}