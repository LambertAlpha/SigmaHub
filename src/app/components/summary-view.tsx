interface Keyword {
    text: string
  }
  
  export function SummaryView() {
    const keywords: Keyword[] = [{ text: "Society" }, { text: "Business" }, { text: "Pioneer" }]
  
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm text-gray-400">Keywords in the video:</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span key={keyword.text} className="rounded-full bg-gray-700 px-3 py-1 text-sm">
                  {keyword.text}
                </span>
              ))}
            </div>
          </div>
  
          <div>
            <h3 className="mb-3 text-sm text-gray-400">Summary:</h3>
            <div className="space-y-4 text-sm">
              <p>
                Pioneer is my team name. Pioneer is also a research program that designed for high school international
                student to develop their research and academic skills, but to be honest, it's a program that help
                international student to get into a better college.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Pioneer is my team name</li>
                <li>
                  Pioneer is also a research program that designed for high school international student to develop their
                  research and academic skills
                </li>
                <li>better, in the context, means higher US News rank</li>
              </ul>
              <button className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600">Go to 10:23</button>
            </div>
          </div>
        </div>
      </div>
    )
  }  