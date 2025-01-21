import { NextResponse } from "next/server";
import { createConnection } from "@/config/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();

        // Kết nối tới cơ sở dữ liệu
        const db = await createConnection();

        // Sử dụng prepared statements để tránh SQL Injection
        let sql = "UPDATE todos SET `name` = ? WHERE `id` = ?";
        let values = [body.name, Number(id)];

        // Thực thi truy vấn
        await db.query(sql, values);


        // Trả về phản hồi thành công
        return NextResponse.json({
            message: `Cập nhật todo có id: ${id} thành công`,
        });

    } catch (error) {
        console.error("Lỗi khi cập nhật todo:", error);
        return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật todo." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Kết nối tới cơ sở dữ liệu
        const db = await createConnection();

        let sql = "DELETE from todos WHERE `id` = ?";
        let values = [Number(id)];

        // Thực thi truy vấn
        await db.query(sql, values);


        // Trả về phản hồi thành công
        return NextResponse.json({
            message: `Xóa todo thành công`,
        });

    } catch (error) {
        console.error("Lỗi khi cập nhật todo:", error);
        return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật todo." }, { status: 500 });
    }
}
