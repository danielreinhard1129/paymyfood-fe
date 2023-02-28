import React, { useState, useRef } from 'react';
import {
    Tbody,
    Tr,
    Td,
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Modal,
    ModalOverlay,
    FormLabel,
    ModalFooter,
    ModalCloseButton,
    ModalHeader,
    ModalContent,
    ModalBody,
    Text,
    FormControl,
    Input,
    Select,
    useToast,
    Image
} from '@chakra-ui/react'
import { HiDocumentAdd } from 'react-icons/hi';
import axios from 'axios';
import { API_URL } from '../helper';

function ProductTable(props) {
    const modalDelete = useDisclosure()
    const modalEdit = useDisclosure()
    const modalProduct = useDisclosure()
    const cancelRef = React.useRef()
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const toast = useToast();

    const inputFile = useRef(null);
    const [fileProduct, setFileProduct] = useState(null)

    const onChangeFile = (event) => {
        modalProduct.onOpen();
        setFileProduct(event.target.files[0]);
    }

    console.log("props image", props.image);

    const printSelectOption = () => {
        console.log(props.dataAllCategory);
        return props.dataAllCategory.map((val, idx) => {
            return <option value={val.id}>{val.category}</option>
        })
    }


    const btnEdit = async () => {
        try {
            let token = localStorage.getItem('pmf_login');
            let formData = new FormData();

            formData.append('data', JSON.stringify({
                product: !product ? props.product : product,
                price: !price ? parseInt(props.price) : parseInt(price),
                category: !category ? parseInt(props.categoryId) : parseInt(category)
            }))
            if (fileProduct != null) {
                formData.append('images', fileProduct);
            }
            let update = await axios.patch(`${API_URL}/product/editproduct/${props.uuid}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (update.data.success) {
                setFileProduct(null)
                // props.keeplogin();
                toast({
                    position: 'top',
                    title: `Edit Success`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  });
                  props.getDataProduct();
                  modalEdit.onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const btnDelete = async () => {
        let hapus = await axios.patch(`${API_URL}/product/deleteproduct`, {
            uuid: props.uuid
        });
        props.getDataProduct();
        modalDelete.onClose();
    }
    return (
        <Tbody>
            <Tr>
                <Td>{props.idx}</Td>
                <Td>{props.product}</Td>
                <Td><Image w='70px' src={`${API_URL}${props.image}`} /></Td>
                <Td>{props.price}</Td>
                <Td>{props.category}</Td>
                <Td>
                    {/* BUTTON EDIT */}
                    <Button
                        bgColor="#00ADB5"
                        onClick={modalEdit.onOpen}
                        mr='4'
                    >
                        <Text  >Edit</Text>
                    </Button>

                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={modalEdit.isOpen}
                        onClose={modalEdit.onClose}
                    >
                        <ModalOverlay />
                        <ModalContent bgColor="#393E46" color={"#EEEEEE"}>
                            <ModalHeader color="#00adb5">
                                Edit Existing Product
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel color={"#EEEEEE"}>
                                        Product
                                    </FormLabel>
                                    <Input
                                        ref={initialRef}
                                        placeholder="Enter product name"
                                        _hover={""}
                                        bgColor="#222831"
                                        variant={"link"}
                                        onChange={(e) => setProduct(e.target.value)}
                                        defaultValue={props.product}
                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel color={"#EEEEEE"}>
                                        Price
                                    </FormLabel>
                                    <Input
                                        ref={initialRef}
                                        placeholder="Enter price"
                                        _hover={""}
                                        bgColor="#222831"
                                        variant={"link"}
                                        onChange={(e) => setPrice(e.target.value)}
                                        defaultValue={props.price}
                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel color={"#EEEEEE"}>
                                        Category
                                    </FormLabel>
                                    <Select placeholder='Select option'
                                        onChange={(e) => setCategory(e.target.value)}
                                        defaultValue={props.category}
                                    >
                                        {printSelectOption()}
                                    </Select>
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel color={"#EEEEEE"}>
                                        Product Image
                                    </FormLabel>
                                    <Button
                                        bgColor="#00ADB5"
                                        color="#EEEEEE"
                                        rounded={"md"}
                                        h={"10"}
                                        _hover={""}
                                        p={"2.5"}
                                        variant={"link"}
                                        onClick={() => inputFile.current.click()}
                                    >
                                        <HiDocumentAdd
                                            color="#EEEEEE"
                                            size={"md"}
                                        />
                                        Add a File
                                    </Button>
                                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={onChangeFile}></input>

                                    <Modal isOpen={modalProduct.isOpen} onClose={modalProduct.onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Change Product Picture</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody textAlign='center'>
                                                <Image objectFit='cover' size='4xl' src={fileProduct ? URL.createObjectURL(fileProduct) : ''}></Image>
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button colorScheme='red' mr={3} onClick={() => {
                                                    modalProduct.onClose();
                                                    setFileProduct(null)
                                                }} variant='solid'>
                                                    Cancel
                                                </Button>
                                                <Button onClick={modalProduct.onClose} colorScheme='green' variant='outline'>Save</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    bgColor="#00ADB5"
                                    color="#EEEEEE"
                                    _hover=""
                                    mr={3}
                                    type='button'
                                    onClick={btnEdit}
                                >
                                    Save
                                </Button>
                                <Button
                                    bgColor="#EEEEEE"
                                    color="#00ADB5"
                                    _hover=""
                                    onClick={modalEdit.onClose}
                                >
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    {/* BUTTON DELETE */}
                    <Button colorScheme='red' onClick={modalDelete.onOpen}>
                        Delete Product
                    </Button>

                    <AlertDialog
                        isOpen={modalDelete.isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={modalDelete.onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Delete
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure? You can't undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={modalDelete.onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='red' onClick={btnDelete} ml={3}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>

                </Td>
            </Tr>
        </Tbody>
    );
}

export default ProductTable;