import apiClient from "./apiClient";


export const fundTerminal = async (amount:string, remark:string, pin:string)=> {
    try {
        const response = await apiClient.post("/user/deposit-to-terminal",{
            amount,remark,pin
        })
        console.log("terminal-response",response)
        return response
    } catch (error) {
        console.log(error)
    }    
}