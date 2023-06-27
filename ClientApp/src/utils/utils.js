export const descriptionShow = (desc) => {
    if(desc.length<20){
        return desc
    }
    return `${desc.substring(0,60)}...`
}