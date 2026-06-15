import { configDotenv } from "dotenv";
import { Resend } from 'resend';

configDotenv();

if(!process.env.RESEND_API_KEY){
    throw new Error("Resend API Key not found")
}
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
}: { to: string;subject: string;text: string;html? : string
 }) => {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL as string,
        to,
        subject,
        text,
        html,
    });
    if(error){
        console.error("resennd error:", error);
        throw error;
    }
    return data;
    
};

