import apiClient from "./apiClient";


export const fundTerminal = async (amount:string, pin:string,remark:string, )=> {
    console.log("terminal", pin, remark,amount)
    try {
        const response = await apiClient.post("/user/deposit-to-terminal",{
           amount,pin,remark
        })
        console.log("terminal-response",response.data)
        return response
    } catch (error) {
        console.log(error)
    }    
}