// import { BuyForm } from "./_components/add-form";

interface AddVirtualAssetsProps {
    params: {
        username: string;
    }
}

const AddAssets = ({
    params
}:AddVirtualAssetsProps) => {
    return (
        <div className="flex justify-center">
            {/* <BuyForm username={params.username}></BuyForm> */}
        </div>
    )
}

export default AddAssets;