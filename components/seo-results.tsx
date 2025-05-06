import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart, Search } from "lucide-react"

interface SEOResultsProps {
  results: {
    score: number
    summary: string
    recommendations: string[]
    keywordAnalysis: {
      keyword: string
      density: number
      competitiveness: number
    }[]
    technicalIssues: {
      type: string
      severity: "low" | "medium" | "high"
      description: string
    }[]
  }
}

export default function SEOResults({ results }: SEOResultsProps) {
  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981" // green
    if (score >= 60) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  // Get score label based on value
  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Average"
    return "Needs Improvement"
  }

  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-8">
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-[#dc6b27]" />
            SEO Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold">{results.score}</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(results.score)}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 45 * (results.score / 100)} ${2 * Math.PI * 45 * (1 - results.score / 100)}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-2">{getScoreLabel(results.score)}</p>
              <p className="text-gray-600">{results.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#dc6b27]" />
            Top Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.recommendations.map((recommendation, index) => (
              <li key={index} className="flex">
                <ChevronRight className="h-5 w-5 text-[#dc6b27] mr-2 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Keyword Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Search className="h-5 w-5 mr-2 text-[#dc6b27]" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.keywordAnalysis.map((keyword, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{keyword.keyword}</span>
                  <Badge
                    variant={keyword.density > 1 ? "default" : "outline"}
                    className={keyword.density > 1 ? "bg-[#dc6b27]" : ""}
                  >
                    {keyword.density.toFixed(1)}% density
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Density</span>
                      <span>{keyword.density.toFixed(1)}%</span>
                    </div>
                    <Progress value={keyword.density * 33.3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Competitiveness</span>
                      <span>{(keyword.competitiveness * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={keyword.competitiveness * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Issues */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-[#dc6b27]" />
            Technical Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {results.technicalIssues.map((issue, index) => (
              <li key={index} className="flex items-start p-3 rounded-lg bg-gray-50">
                {issue.severity === "high" ? (
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : issue.severity === "medium" ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">
                    {issue.type}
                    <Badge
                      variant="outline"
                      className={`ml-2 ${
                        issue.severity === "high"
                          ? "text-red-500 border-red-200 bg-red-50"
                          : issue.severity === "medium"
                            ? "text-amber-500 border-amber-200 bg-amber-50"
                            : "text-green-500 border-green-200 bg-green-50"
                      }`}
                    >
                      {issue.severity}
                    </Badge>
                  </p>
                  <p className="text-gray-600 text-sm">{issue.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
