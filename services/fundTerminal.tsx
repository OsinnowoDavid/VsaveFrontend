import apiClient from "./apiClient";


export const fundTerminal = async (amount:string, remark:string, pin:string)=> {
    try {
        const response = await apiClient.post("/user/deposit-to-terminal",{
           pin, amount,remark
        })
        console.log("terminal-response",response.data)
        return response
    } catch (error) {
        console.log(error)
    }    
}