import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 테스트 유저 생성
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "테스트 유저",
      password: "1234",
    },
  });

  // 미션 생성
  await prisma.mission.createMany({
    data: [
      { title: "책 10페이지 읽기", exp: 5, userId: user.id },
      { title: "운동 30분 하기", exp: 10, userId: user.id },
      { title: "감사일기 쓰기", exp: 4, userId: user.id },
    ],
  });

  // 방 생성
  await prisma.room.create({
    data: {
      name: "기본 방",
      theme: "classic",
      userId: user.id,
    },
  });

  console.log("✅ 시드 데이터 생성 완료!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
