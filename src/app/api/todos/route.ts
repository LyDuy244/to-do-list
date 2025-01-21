import {createConnection} from "@/config/db";
import {NextResponse} from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const db = await createConnection()
        let sql = "SELECT * FROM todos";
        let [todos] = await db.query(sql);


        return  NextResponse.json({
            message: "Lấy danh sách todo thành công",
            data: todos
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message})
    }
}

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    try {
        const db = await createConnection()
        let sql = "INSERT INTO todos (`name`) VALUES (?)";
        let values = [body.name]
        await db.query(sql, values);


        // Trả về phản hồi thành công
        return NextResponse.json({
            message: "Thêm todo thành công",
            data: { name: body.name }
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message})
    }
}