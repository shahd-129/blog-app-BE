const generateMessege = (entity) => ({
    alreadyExist: `${entity} Aleardy Exist`,
    notFound: `${entity} Not Found`,
    failToCreate: `Fail To Create ${entity}`,
    failToUpdate: `Fail To Update ${entity}`,
    createSuccessfuly: `${entity} Created Successfully`,
    updateSuccessfully: `${entity} Updated Successfully`,
    deleteSuccessfully: `${entity} Deleted Successfully`,
    faildPassword: "Password Is Invaild"
})


export const message = {
  user:generateMessege("User"),
  file:{required: "File Is Required"}
};
