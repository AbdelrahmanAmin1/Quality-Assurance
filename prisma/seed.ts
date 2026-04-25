import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "mostafa@aucegypt.edu" },
    update: {},
    create: {
      email: "mostafa@aucegypt.edu",
      name: "Mostafa Abdelaal",
      passwordHash: await hashPassword("password123"),
      profile: {
        create: {
          field: "Computer Science",
          goal: "Ace my exams",
          dailyMinutes: 45,
          onboardingDone: true
        }
      },
      settings: { create: { theme: "dark" } }
    }
  });

  const course = await prisma.course.upsert({
    where: { userId_code: { userId: user.id, code: "CSCI 3411" } },
    update: {},
    create: { userId: user.id, code: "CSCI 3411", title: "Data Structures & Algorithms", term: "Spring 2026" }
  });

  await prisma.material.create({
    data: {
      userId: user.id,
      courseId: course.id,
      title: "Data Structures - Textbook",
      type: "pdf",
      sourceName: "data-structures.pdf",
      status: "processed",
      summary: "Hash tables, linked lists, trees, and graph traversal.",
      progress: 62
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
