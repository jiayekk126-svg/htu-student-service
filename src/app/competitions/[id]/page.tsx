import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { aClassCompetitions } from '@/data/competitions'

const detailData: Record<string, { content: string; tips: string[] }> = {
  a1: {
    content: `中国国际大学生创新大赛（原"互联网+"大学生创新创业大赛）是教育部等12部委联合主办的全国性创新创业大赛，是目前国内影响力最大、覆盖面最广的大学生创新创业赛事。

## 赛事亮点
- 参赛规模最大，每年吸引超过100万大学生参与
- 覆盖高校最多，全国2800+高校参与
- 奖金丰厚，优胜项目可获得投资孵化机会
- 国家政策重点支持，获奖项目在升学、就业中具有重要加分

## 参赛组别
1. 高教主赛道（创意组、初创组、成长组）
2. 青年红色筑梦之旅赛道
3. 职教赛道
4. 产业命题赛道

## 参赛流程
- 校赛（3-5月）：校内选拔
- 省赛（6-8月）：省级复赛
- 国赛（9-10月）：全国总决赛`,
    tips: ['建议大一、大二就开始准备项目', '跨学科组队更有优势', '关注社会痛点和国家战略方向'],
  },
  a10: {
    content: `"挑战杯"全国大学生课外学术科技作品竞赛被誉为中国大学生学术科技的"奥林匹克"，由共青团中央、中国科协、教育部、全国学联共同主办。

## 赛事分类
1. 自然科学类学术论文
2. 哲学社会科学类社会调查报告
3. 科技发明制作A类（科技含量较高）
4. 科技发明制作B类（投入较少，贴近生活）

## 参赛建议
- 选题要有学术价值或社会意义
- 注重数据的真实性和科学性
- 论文和报告要规范严谨

### 备赛要点
1. 提前半年到一年准备
2. 组建跨学科团队
3. 寻找专业指导老师
4. 多轮打磨修改作品`,
    tips: ['注重原创性和学术规范', '数据要真实可靠', '答辩准备要充分'],
  },
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const comp = aClassCompetitions.find((c) => c.id === id)
  if (!comp) notFound()

  const details = detailData[id]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/competitions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#003366] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回竞赛列表
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-red-100 text-red-700">{comp.class}类</Badge>
          <span className="inline-flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < comp.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">{comp.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{comp.description}</p>
      </div>

      <a href={comp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#C41A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#a01515] transition-colors mb-8">
        官网入口 <ExternalLink className="h-4 w-4" />
      </a>

      {details && (
        <>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-[#003366] prose-headings:font-heading prose-a:text-[#003366] prose-code:bg-muted prose-code:px-1 prose-code:rounded mb-8">
            <div dangerouslySetInnerHTML={{ __html: details.content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2 class="text-lg font-bold text-[#003366] mt-6 mb-2">$1</h2>').replace(/### (.*)/g, '<h3 class="text-base font-bold mt-4 mb-1">$1</h3>').replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>').replace(/\d\. (.*)/g, '<li class="ml-4 list-decimal">$1</li>') }} />
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">💡 备赛小贴士</h3>
            <ul className="space-y-1">
              {details.tips.map((tip, i) => (
                <li key={i} className="text-sm text-amber-700">{i + 1}. {tip}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
