import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('123456', 10)

  const user = await prisma.user.upsert({
    where: { email: '3619114044@qq.com' },
    update: {},
    create: {
      id: '2024001',
      username: '一只羊啊',
      email: '3619114044@qq.com',
      password,
      bio: '程序员，嵌入式，AI，JAVA',
      phone: '17539169851',
      schoolId: '2528724070',
      className: '2024级计算机科学与技术1班',
      department: '计算机与信息工程学院',
      skills: JSON.stringify(['C语言', 'JAVA', 'Python', 'Pytorch', 'HTML', 'CSS', 'JavaScript', 'Spring框架']),
      githubUsername: 'kangjiaye',
      avatar: '/uploads/banner-head-icon.jpg',
    },
  })

  const users = [
    { id: '2024002', username: '算法小菜鸟', email: 'a@test.com', password },
    { id: '2024003', username: '美食达人小王', email: 'b@test.com', password },
    { id: '2024004', username: '考研冲冲冲', email: 'c@test.com', password },
    { id: '2024005', username: '机器人爱好者', email: 'd@test.com', password },
    { id: '2024006', username: '技术宅阿强', email: 'e@test.com', password },
    { id: '2024007', username: '摄影小能手', email: 'f@test.com', password },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    })
  }

  const post1 = await prisma.post.create({
    data: {
      content: '2026的序章，由你我执笔，愿每一步都踏着光，奔赴山海，记得新的一年\n"别感冒！"\nHappy New Year ❤️',
      images: JSON.stringify([9, 10, 7, 4, 8, 6, 2, 5, 3].map(i => `/blog-images/image${i}.jpg`)),
      device: '荣耀400',
      location: '河南·新乡',
      userId: user.id,
      viewCount: 299104,
      forwardCount: 23842,
      isForum: false,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: '希望2026年能越来越好 ✨',
      images: JSON.stringify(['/blog-images/image1.jpg']),
      device: '荣耀400',
      location: '河南·新乡',
      userId: user.id,
      viewCount: 110484,
      forwardCount: 15613,
      isForum: false,
    },
  })

  const likesData = [
    { userId: '2024002', postId: post1.id },
    { userId: '2024003', postId: post1.id },
    { userId: '2024004', postId: post2.id },
  ]
  for (const l of likesData) {
    await prisma.like.create({ data: l }).catch(() => {})
  }

  await prisma.comment.create({
    data: { content: '新年快乐！🎉', userId: '2024002', postId: post1.id },
  })
  await prisma.comment.create({
    data: { content: '一起加油！💪', userId: '2024003', postId: post1.id },
  })

  await prisma.bookmark.create({
    data: { userId: '2024002', postId: post1.id },
  }).catch(() => {})

  await prisma.follow.create({
    data: { followerId: '2024002', followingId: user.id },
  }).catch(() => {})

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
