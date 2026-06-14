import crypto from "crypto";
import { configDotenv } from "dotenv";
import { Resend } from 'resend';

configDotenv();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
}: { to: string;subject: string;text: string;html ? : string
 }) => {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || "Acme <onboarding@resend.dev>",//until we stop using free one
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

