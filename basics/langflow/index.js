import  {LangflowClient} from "@datastax/langflow-client"

const langflowId = "1c50f4db-b316-46c3-b05d-135c58ea1ab9"
const flowId = "993cb9b2-7857-4329-b535-129176aa481e"
const apiKey = "your_Langflow_api_key"

const client = new LangflowClient({langflowId, apiKey})
const flow = client.flow(flowId)

const result = await flow.run("laptop for gaming")
console.log(result.chatOutputText())