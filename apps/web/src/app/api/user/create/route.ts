// app/api/auth/signup/route.ts

import prisma from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, email, firstName, lastName } = await req.json();

    // Basic validation example (you can add more validation if needed)
    if (!email || !id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await prisma.users.create({
      data: {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: 'User created successfully', userId: id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error during sign up or user creation:', error);

    let errorMessage =
      error?.message || 'An unknown error occurred during sign up';

    // Firebase specific error handling example:
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use';
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
