import type { User } from '@/types'

export const currentUser: User = {
  id: '2024001',
  name: '一只羊啊',
  avatar: '',
  studentId: '20240701001',
  major: '计算机科学与技术',
  email: '3619114044@qq.com',
  bio: '程序员，嵌入式，AI，JAVA',
  skills: ['C语言', 'JAVA', 'Python', 'Pytorch', 'HTML', 'CSS', 'JavaScript', 'Spring框架'],
  achievements: [
    '第三十八届河南省科技创新大赛省一等奖',
    '第二十二届河南自制教具发明赛省一等奖',
  ],
  level: 'Lv.5',
  source: '荣耀400',
}

export const mockUsers: User[] = [
  currentUser,
  {
    id: '2024002',
    name: '李华',
    avatar: '',
    studentId: '20240701002',
    major: '软件工程',
    email: 'lihua@stu.htu.edu.cn',
  },
  {
    id: '2024003',
    name: '王芳',
    avatar: '',
    studentId: '20240503001',
    major: '数学与应用数学',
    email: 'wangfang@stu.htu.edu.cn',
  },
  {
    id: '2024004',
    name: '赵强',
    avatar: '',
    studentId: '20240602001',
    major: '英语',
    email: 'zhaoqiang@stu.htu.edu.cn',
  },
  {
    id: '2024005',
    name: '陈晓',
    avatar: '',
    studentId: '20240801001',
    major: '电子信息工程',
    email: 'chenxiao@stu.htu.edu.cn',
  },
]

export const profileUser: User = {
  ...currentUser,
  id: 'profile_001',
  name: '一只羊啊',
  avatar: '',
  studentId: '20240701001',
  major: '计算机科学与技术',
  email: '3619114044@qq.com',
  bio: '程序员，嵌入式，AI，JAVA',
  skills: ['C语言', 'JAVA', 'Python', 'Pytorch', 'HTML', 'CSS', 'JavaScript', 'Spring框架'],
  achievements: [
    '第三十八届河南省科技创新大赛省一等奖',
    '第二十二届河南自制教具发明赛省一等奖',
  ],
  level: 'Lv.5',
  source: '荣耀400',
}
