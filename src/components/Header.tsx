import { Box, Toolbar, Typography, InputBase } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { Autocomplete } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';


const Header = () => {
    const [showSearch, setShowSearch] = useState<boolean>(false);

    const onLoad = () => { }
    const onPlaceChanged = () => { }

    return (
        <>
            <main className='hidden md:flex'>
                <AppBar>
                    <Toolbar className='flex justify-between'>
                        <Typography variant='h5' fontSize='20px' className='hidden md:flex text-[12px] md:text-[20px]'>
                            Travel Companion
                        </Typography>
                        <Box display="flex" alignItems='center' gap='10px'>
                            <Typography variant='h6' fontSize='17px' className='hidden md:flex'>
                                Explore new places
                            </Typography>
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} className='hidden md:flex border-0'>
                                <div className='flex gap-1 px-2 py-1.5 relative rounded-lg bg-[#ffffff40] text-white hover:bg-[#ffffff64] mr-2 ml-0 w-full z-0'>
                                    <div className='mt-0.5'>
                                        <SearchIcon />
                                    </div>
                                    <InputBase placeholder="Search..." sx={{ color: 'white' }} />
                                </div>
                            </Autocomplete>
                        </Box>
                    </Toolbar>
                </AppBar>
            </main>
            <main className='md:hidden'>
                <AppBar>
                    <Toolbar className='flex justify-between'>
                        {!showSearch ? (
                            <Box width={'100%'} display="flex" alignItems='center' gap='10px'>
                                <div className="w-[100%] flex md:hidden justify-between">
                                    <h5 className='text-[20px]'>Travel Companion</h5>
                                    <SearchIcon className="!text-[30px] cursor-pointer" onClick={() => setShowSearch(true)} />
                                </div>
                            </Box>
                        ) : (
                            <Box width={'100%'} display="flex" alignItems='center' gap='10px'>
                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} className='border-0 w-full'>
                                    <div className='flex gap-1 px-2 py-1.5 relative rounded-lg bg-[#ffffff40] text-white hover:bg-[#ffffff64] mr-2 ml-0 w-full z-0'>
                                        <InputBase placeholder="Search..." sx={{ color: 'white', width: '100%' }} />
                                        <div className='mt-0.5'>
                                            <CloseIcon onClick={() => setShowSearch(false)} />
                                        </div>
                                    </div>
                                </Autocomplete>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>
            </main>
        </>
    )
}

export default Header
