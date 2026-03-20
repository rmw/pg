/** @jsx jsx */
import { jsx } from "theme-ui"
import ProjectCard from "@lekoarts/gatsby-theme-cara/src/components/project-card"
import { getDateForWeek, getWhatToExpectUrl } from "../../../lib/pregnancy"
import { buildConceptionInfo, getMilestoneConfig } from "../../../lib/config"
import config from "../../../../pregnancy.config.json"

const conceptionInfo = buildConceptionInfo(config)
const milestones = getMilestoneConfig(config)

const GRADIENTS = [
  "linear-gradient(to right, #D4145A 0%, #FBB03B 100%)",
  "linear-gradient(to right, #662D8C 0%, #ED1E79 100%)",
  "linear-gradient(to right, #009245 0%, #FCEE21 100%)",
  "linear-gradient(to right, #D585FF 0%, #00FFEE 100%)",
]

const Milestones = () => (
  <>
    {milestones.map((m, i) => {
      const date = getDateForWeek(conceptionInfo, m.weeks)
      const url = getWhatToExpectUrl(m.weeks)
      const bg = GRADIENTS[i % GRADIENTS.length]

      return (
        <ProjectCard key={m.label} title={m.label} link={url} bg={bg}>
          <h2>{date.toLocaleDateString()}</h2>
        </ProjectCard>
      )
    })}
  </>
)

export default Milestones
