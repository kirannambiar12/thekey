import { NextResponse } from "next/server";
import { getAuthUser, type AuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";

interface RouteContext {
  user: AuthUser;
  request: Request;
}

export async function handleRoute(
  request: Request,
  handler: (context: RouteContext) => Promise<unknown>,
): Promise<NextResponse> {
  try {
    const user = getAuthUser(request.headers);
    const data = await handler({ user, request });
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status: error.statusCode },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 },
    );
  }
}
