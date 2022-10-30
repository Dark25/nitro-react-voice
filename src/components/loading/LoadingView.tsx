import { FC, useCallback, useEffect } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from 'tsparticles';
import { polygonPathName } from "tsparticles-path-polygon";
import { NotificationUtilities } from '../../api';
import { Base, Column, LayoutProgressBar, Text } from '../../common';


interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;

    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    useEffect(() =>
    {
        if(!isError) return;

        NotificationUtilities.simpleAlert(message, null, null, null, 'Connection Error');
    }, [ isError, message ]);
    
    return (
        <>
        
        <Column fullHeight position="relative" className="nitro-loading">
        
            <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <Base className="connecting-duck animate__animated animate__pulse animate__faster animate__infinite" />
                    <Column size={ 6 } className="text-center py-4">
                      
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{ message }</Base>
                            :
                            <>
                                <Text fontSize={ 4 } variant="white" className="text-shadow">{ percent.toFixed() }%</Text>
                                <LayoutProgressBar progress={ percent } className="mt-2 large" />
                            </>
                        }
                        
                    </Column>
                </Column>
            </Base>
        </Column>
        </>
    );
}
