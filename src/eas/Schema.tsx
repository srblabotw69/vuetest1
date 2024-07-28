import { useEffect, useState } from "react";
import GradientBar from "../components/GradientBar";
import { useAccount, useSigner } from "wagmi";
import { useModal } from "connectkit";
import {
  baseURL,
  // CUSTOM_SCHEMAS,
  EASContractAddress,
  getAddressForENS,
  EASSchemaRegistryAddress,
  EASResolverAddress,
  // getSchema,
} from "../utils/utils";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
// import { ethers } from "ethers";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import { Sidebar } from "../components/Sidebar"
import {
  Title,
  Container,
  MetButton,
  StyledTextarea,
  InputContainer,
  EnsLogo,
  InputBlock,
  WhiteBox,
} from "../styles/web"
// import { ethers } from "ethers";
 

// import {} from 'dotenv/config' 
// import 'dotenv/config'
// require('dotenv').config();
// import * as dotenv from 'dotenv';
// dotenv.config();
// import dotenv from "dotenv";
// import path from "path";

// import * as dotenv from "dotenv";
// dotenv.config()

const eas = new EAS(EASContractAddress);
 

// Parsing the env file.
// dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });
 


function Schema() {
 
  // sc:
  // const provider = useProvider();
  const signer2 = useSigner();

  const { status } = useAccount();
  const modal = useModal();
  const [address, setAddress] = useState("");
  const { data: signer } = useSigner();
  // const [attesting, setAttesting] = useState(false);

  // sc:
  const [uidVal, setUID] = useState("");
  const [schemaing, setSchemaing] = useState(false);
  const [creatingSchema, setCreateSchema] = useState(false);
  const [schema, setSchema] = useState("");
  // const [privateKey, setPrivateKey] = useState<any>("");

  const [ensResolvedAddress, setEnsResolvedAddress] = useState("Dakh.eth");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) {
      setAddress(addressParam);
    }
    const uidParam = searchParams.get("uidVal");
    if (uidParam) {
      setUID(uidParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkENS() {
      if (address.includes(".eth")) {
        const tmpAddress = await getAddressForENS(address);
        if (tmpAddress) {
          setEnsResolvedAddress(tmpAddress);
        } else {
          setEnsResolvedAddress("");
        }
      } else {
        setEnsResolvedAddress("");
      }
    }

    checkENS();
  }, [address, uidVal]);
 

  // // Convert a string to a byte array
  // function convertStringToByteArray(str: string) {     
  //   console.log(str)                                                                                                                                 
  //   var bytes = [];                                                                                                                                                             
  //   for (var i = 0; i < str.length; ++i) {                                                                                                                                      
  //     bytes.push(str.charCodeAt(i));                                                                                                                                            
  //   }                                                                                                                                                                           
  //   return bytes                                                                                                                                                                
  // }


  // setPrivateKey(process.env.REACT_APP_PRIVATE_KEY)
  // console.log(privateKey)

  return (
    <Container>
      <Sidebar />
      <GradientBar />
      <WhiteBox>
        <Title>
          Get Schema
        </Title>

        <InputContainer>
          <InputBlock
            autoCorrect={"off"}
            autoComplete={"off"}
            autoCapitalize={"off"}
            placeholder={"Address/ENS"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {ensResolvedAddress && <EnsLogo src={"/ens-logo.png"} />}
        </InputContainer>
        <MetButton
          onClick={async () => {
            if (status !== "connected") {
              modal.setOpen(true);
            } else {
              setCreateSchema(true);

              try {
                // const schemaEncoder = new SchemaEncoder("bool metIRL");
                // const encoded = schemaEncoder.encodeData([
                //   { name: "metIRL", type: "bool", value: true },
                // ]);
                // console.log(process.env.REACT_APP_PRIVATE_KEY)
                // setPrivateKey(process.env.REACT_APP_PRIVATE_KEY)
 
                // convertStringToByteArray(process.env.REACT_APP_PRIVATE_KEY)
   
                // console.log(process.env.REACT_APP_PRIVATE_KEY);

                // // // Signer is an ethers.js Signer instance
                // const signer2 = new ethers.Wallet(
                //   '1053e50356e544f9f3968e267bb9222010f532ae7a452762f2033f03cc73db66', provider);
                // const signer = new ethers.Wallet(
                //   'process.env.REACT_APP_PRIVATE_KEY', provider);
              
                
                invariant(signer2, "signer must be defined");
                // eas.connect(signer);

                const recipient = ensResolvedAddress
                  ? ensResolvedAddress
                  : address;

                console.log(EASSchemaRegistryAddress)

                const schemaRegistry = new SchemaRegistry(EASSchemaRegistryAddress);

                // schemaRegistry.connect(signer);

                const schema = "uint256 eventId, uint8 voteIndex";
                const resolverAddress = EASResolverAddress      // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26

                console.log(schemaRegistry, resolverAddress)
                const revocable = true;

                const transaction = await schemaRegistry.register({
                  schema,
                  resolverAddress,
                  revocable,
                });

                // Optional: Wait for transaction to be validated
                await transaction.wait();

                //  // Optional: Wait for transaction to be validated
                //  const uid = await transaction.wait();

                // console.log(uid)



                // Update ENS names
                await Promise.all([
                  axios.get(`${baseURL}/api/getENS/${address}`),
                  axios.get(`${baseURL}/api/getENS/${recipient}`),
                ]);

                navigate(`/happyattest/schema`);
              } catch (e) { }

              setCreateSchema(false);
            }
          }}
        >
          {creatingSchema
            ? "Creating Schema..."
            : status === "connected"
              ? "Create Schema"
              : "Connect wallet"}
        </MetButton>


        <br></br>

        <InputContainer>
          <InputBlock
            autoCorrect={"off"}
            autoComplete={"off"}
            autoCapitalize={"off"}
            placeholder={"schemaUID"}
            value={uidVal}
            onChange={(e) => {setUID(e.target.value); 
              setSchema(""); }}
          />
          {ensResolvedAddress && <EnsLogo src={"/ens-logo.png"} />}
        </InputContainer>
        <MetButton
          onClick={async () => {
            if (status !== "connected") {
              modal.setOpen(true);
            } else {
              setSchemaing(true);

              try {
                // const schemaEncoder = new SchemaEncoder("bool metIRL");
                // const encoded = schemaEncoder.encodeData([
                //   { name: "metIRL", type: "bool", value: true },
                // ]);

                invariant(signer, "signer must be defined");
                eas.connect(signer);

                const recipient = ensResolvedAddress
                  ? ensResolvedAddress
                  : address;

                // const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
                const schemaRegistry = new SchemaRegistry(EASSchemaRegistryAddress);

                schemaRegistry.connect(signer);

                // const schemaUID = "0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7"; // sc: schemaId
                //const schemaUID = "0x49d9700408d4ed2c132a3d6410ada3ed794e9d927accfdc02a9ceae75de7af97";
                const schemaUID = uidVal;

                const schema = await schemaRegistry.getSchema({ uid: schemaUID });
                // const schema = await getSchema( schemaUID);
                console.log(schema)

                setSchema(JSON.stringify(schema))

                // Update ENS names
                await Promise.all([
                  axios.get(`${baseURL}/api/getENS/${address}`),
                  axios.get(`${baseURL}/api/getENS/${recipient}`),
                ]);

                navigate(`/happyattest/schema`);
              } catch (e) { }

              setSchemaing(false);
            }
          }}
        >
          {schemaing
            ? "Getting Schema..."
            : status === "connected"
              ? "Get Schema"
              : "Connect wallet"}
        </MetButton>

        <div>
          <InputContainer>
            <StyledTextarea
              value={schema}
              onChange={(e) => setSchema("")}
            />
          </InputContainer>
        </div>


      </WhiteBox>
    </Container>
  );
}

export default Schema;


// import { useEffect, useState } from "react";
// import GradientBar from "../components/GradientBar";
// import { useAccount, useSigner } from "wagmi";
// import { useModal } from "connectkit";
// import {
//   baseURL,
//   // CUSTOM_SCHEMAS,
//   EASContractAddress,
//   getAddressForENS,
//   EASSchemaRegistryAddress,
//   EASResolverAddress,
//   // getSchema,
// } from "../utils/utils";
// import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
// import invariant from "tiny-invariant";
// // import { ethers } from "ethers";
// import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import { Sidebar } from "../components/Sidebar"
// import { 
//   Title,
//   Container,
//   MetButton,
//   StyledTextarea,
//   InputContainer,
//   EnsLogo,
//   InputBlock, 
//   WhiteBox,
// } from "../styles/web"

// const eas = new EAS(EASContractAddress);

// function Schema() {
//   const { status } = useAccount();
//   const modal = useModal();
//   const [address, setAddress] = useState("");
//   const { data: signer } = useSigner();
//   // const [attesting, setAttesting] = useState(false);

//   // sc:

//   const [uidVal, setUID] = useState("");
//   const [schemaing, setSchemaing] = useState(false);
//   const [creatingSchema, setCreateSchema] = useState(false);
//   const [schema, setSchema] = useState("");

//   const [ensResolvedAddress, setEnsResolvedAddress] = useState("Dakh.eth");
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const addressParam = searchParams.get("address");
//     if (addressParam) {
//       setAddress(addressParam);
//     }
//     const uidParam = searchParams.get("uidVal");
//     if (uidParam) {
//       setUID(uidParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function checkENS() {
//       if (address.includes(".eth")) {
//         const tmpAddress = await getAddressForENS(address);
//         if (tmpAddress) {
//           setEnsResolvedAddress(tmpAddress);
//         } else {
//           setEnsResolvedAddress("");
//         }
//       } else {
//         setEnsResolvedAddress("");
//       }
//     }

//     checkENS();
//   }, [address, uidVal]);

//   return (
//     <Container>
//        <Sidebar />
//       <GradientBar />
//       <WhiteBox>
//         <Title>
//           Get Schema
//         </Title>

//         <InputContainer>
//           <InputBlock
//             autoCorrect={"off"}
//             autoComplete={"off"}
//             autoCapitalize={"off"}
//             placeholder={"Address/ENS"}
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />
//           {ensResolvedAddress && <EnsLogo src={"/ens-logo.png"} />}
//         </InputContainer>
//         <MetButton
//           onClick={async () => {
//             if (status !== "connected") {
//               modal.setOpen(true);
//             } else {
//               setCreateSchema(true);

//               try {
//                 // const schemaEncoder = new SchemaEncoder("bool metIRL");
//                 // const encoded = schemaEncoder.encodeData([
//                 //   { name: "metIRL", type: "bool", value: true },
//                 // ]);

//                 invariant(signer, "signer must be defined");
//                 eas.connect(signer);

//                 const recipient = ensResolvedAddress
//                   ? ensResolvedAddress
//                   : address;

//                 console.log(EASSchemaRegistryAddress)

//                 const schemaRegistry = new SchemaRegistry(EASSchemaRegistryAddress);

//                 schemaRegistry.connect(signer);

//                 const schema = "uint256 eventId, uint8 voteIndex";
//                 const resolverAddress = EASResolverAddress      // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26

//                 console.log(schemaRegistry, resolverAddress)
//                 const revocable = true;

//                 const transaction = await schemaRegistry.register({
//                   schema,
//                   resolverAddress,
//                   revocable,
//                 });

//                 // Optional: Wait for transaction to be validated
//                 await transaction.wait();

//                 //  // Optional: Wait for transaction to be validated
//                 //  const uid = await transaction.wait();

//                 // console.log(uid)



//                 // Update ENS names
//                 await Promise.all([
//                   axios.get(`${baseURL}/api/getENS/${address}`),
//                   axios.get(`${baseURL}/api/getENS/${recipient}`),
//                 ]);

//                 navigate(`/happyattest/schema`);
//               } catch (e) { }

//               setCreateSchema(false);
//             }
//           }}
//         >
//           {creatingSchema
//             ? "Creating Schema..."
//             : status === "connected"
//               ? "Create Schema"
//               : "Connect wallet"}
//         </MetButton>


//         <br></br>

//         <InputContainer>
//           <InputBlock
//             autoCorrect={"off"}
//             autoComplete={"off"}
//             autoCapitalize={"off"}
//             placeholder={"Address/ENS"}
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />
//           {ensResolvedAddress && <EnsLogo src={"/ens-logo.png"} />}
//         </InputContainer>
//         <MetButton
//           onClick={async () => {
//             if (status !== "connected") {
//               modal.setOpen(true);
//             } else {
//               setSchemaing(true);

//               try {
//                 // const schemaEncoder = new SchemaEncoder("bool metIRL");
//                 // const encoded = schemaEncoder.encodeData([
//                 //   { name: "metIRL", type: "bool", value: true },
//                 // ]);

//                 invariant(signer, "signer must be defined");
//                 eas.connect(signer);

//                 const recipient = ensResolvedAddress
//                   ? ensResolvedAddress
//                   : address;

//                 // const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
//                 const schemaRegistry = new SchemaRegistry(EASSchemaRegistryAddress);

//                 schemaRegistry.connect(signer);

//                 // const schemaUID = "0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7"; // sc: schemaId
//                 const schemaUID = "0x49d9700408d4ed2c132a3d6410ada3ed794e9d927accfdc02a9ceae75de7af97";

//                 const schema = await schemaRegistry.getSchema({ uid: schemaUID });
//                 // const schema = await getSchema( schemaUID);
//                 console.log(schema)

//                 setSchema(JSON.stringify(schema))

//                 // Update ENS names
//                 await Promise.all([
//                   axios.get(`${baseURL}/api/getENS/${address}`),
//                   axios.get(`${baseURL}/api/getENS/${recipient}`),
//                 ]);

//                 navigate(`/happyattest/schema`);
//               } catch (e) { }

//               setSchemaing(false);
//             }
//           }}
//         >
//           {schemaing
//             ? "Getting Schema..."
//             : status === "connected"
//               ? "Get Schema"
//               : "Connect wallet"}
//         </MetButton>

//         <div>
//           <InputContainer>
//             <StyledTextarea
//               value={schema}
//               onChange={(e) => setAddress("")}
//             />
//           </InputContainer>
//         </div>


//       </WhiteBox>
//     </Container>
//   );
// }

// export default Schema;
