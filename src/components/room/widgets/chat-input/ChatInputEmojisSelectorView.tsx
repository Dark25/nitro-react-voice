import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { RoomWidgetChatMessage } from '../../../../api';
import { Base, Grid, NitroCardContentView } from '../../../../common';
import { useRoomContext } from '../../RoomContext';

export const ChatInputEmojisSelectorView: FC<{}> = props =>
{
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);
    const [ emojis, setEmojis ] = useState(null);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    useEffect(() =>
    {
        fetch("https://swfs.akiled.org/int/getEmojis.json")
        .then(response => response.json())
        .then((response) => { 
            setEmojis(response);
        })
    }, []);

    function getEmojiImage(emoji){
        return emoji  ;
    }

    const sendEmoji = (event: MouseEvent<HTMLElement>, key: string) =>
    {
        sendChat(key, RoomWidgetChatMessage.CHAT_DEFAULT, '', 0)
        let visible = true;

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        console.log("xdd");

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    const sendChat = useCallback((text: string, chatType: number, recipientName: string = '', styleId: number = 0) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetChatMessage(RoomWidgetChatMessage.MESSAGE_CHAT, text, chatType, recipientName, styleId));
        setSelectorVisible(false)
    }, [ widgetHandler ]);

    const toggleSelector = (event: MouseEvent<HTMLElement>) =>
    {
        let visible = true;

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        console.log("xdd");

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    useEffect(() =>
    {
        if(selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    return (
        <>
            <Base pointer className="icon chatemojis-icon" onClick={ toggleSelector } style={{ marginLeft: "13px", display: "inline-block"}}>
                <Overlay show={ selectorVisible } target={ target } placement="top">
                    <Popover className="nitro-chat-sticker-selector-container image-rendering-pixelated">
                        <NitroCardContentView overflow="hidden" className="bg-transparent">
                            { emojis != null ? (
                                <>
                                    <Grid columnCount={ 4 } overflow="auto">
                                        {emojis.map((emoji) => 
                                            <>
                                            <Base className="text-center" key={ emoji.emoji } onClick={(e) => sendEmoji(e, emoji.emoji)}>
                                            <a>{getEmojiImage(emoji.emoji)}</a><br/>
                                            </Base>
                                            </>
                                        )}
                                    </Grid>
                                </>   
                            ) : (
                                <>
                                </>
                            )}
                        </NitroCardContentView>
                    </Popover>
                </Overlay>
            </Base>
        </>
    );
}
