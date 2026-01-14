import { $getRoot, $getSelection, COMMAND_PRIORITY_LOW, KEY_DOWN_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND, CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND
} from 'lexical';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Heading1, Heading2, Heading3, Italic, List, ListOrdered, Redo, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart, Undo } from 'lucide-react';
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { mergeRegister } from "@lexical/utils";
import { $generateHtmlFromNodes } from "@lexical/html";



function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const [blockType, setBlockType] = useState('paragraph');
    const [textAlign, setTextAlign] = useState('left');
    const [textFormat, setTextFormat] = useState([]);
    const [listType, setListType] = useState(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);


    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const anchorNode = selection.anchor.getNode();
                    const element = anchorNode.getKey() === "root"
                        ? anchorNode
                        : anchorNode.getTopLevelElementOrThrow();

                    let type = element.getType();
                    if (element instanceof HeadingNode) {
                        type = element.getTag();
                    }
                    setBlockType(type);


                    if (selection.hasFormat('bold')) {
                        setTextFormat('bold')
                    }
                    else if (selection.hasFormat('italic')) {
                        setTextFormat('italic')
                    }
                    else {
                        setTextFormat(null)
                    }


                }
            });
        });
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);




    useEffect(() => {
        let lastWasEnter = false;

        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event) => {
                if (event.key === "Enter") {
                    if (listType !== null) {
                        if (lastWasEnter) {

                            event.preventDefault();

                            setListType(null);
                            lastWasEnter = false;
                            return true;
                        }


                        lastWasEnter = true;
                        return false;
                    }
                } else {
                    lastWasEnter = false;
                }

                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, listType]);



    const toggleTextFormat = (format) => {
        editor.update(() => {
            if (textFormat && textFormat !== format) { editor.dispatchCommand(FORMAT_TEXT_COMMAND, textFormat); }
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
            setTextFormat(prev => (prev === format ? null : format));
        });
    }


    const toggleHeading = (level) => {

        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () =>
                    level === "paragraph" ? null : $createHeadingNode(level)
                );
            }
        });
    }

    const toggleTextAlign = (align) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
        setTextAlign(align);
    }

    const toggleList = (type) => {
        if (listType === type) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            setListType(null);
            return;
        }

        if (type === "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            setListType('ol')
        } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            setListType('ul')
        }
    };




    return (
        <div className="flex items-center justify-items-start border border-gray-300 rounded-t-sm w-full py-1 gap-1 text-slate-700 ">
            <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className={`${!canUndo ? 'bg-gray-100' : 'cursor-pointer hover:bg-gray-300 hover:text-slate-900'}  p-0.5  border-0 rounded-sm h-6 w-8 flex items-center justify-center ml-1`}>
                <Undo className="size-6 " />
            </button>
            <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className={` ${!canRedo ? 'bg-gray-100' : 'cursor-pointer hover:bg-gray-300 hover:text-slate-900'} p-0.5 border-0 rounded-sm h-6 w-8 flex items-center justify-center `}>
                <Redo className='size-6 ' />
            </button>
            <div className="border-l-2 h-6 border-gray-300"></div>
            <button onClick={() => toggleHeading('h1')} className={`${blockType === "h1" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                <Heading1 className='size-5' />
            </button>
            <button onClick={() => toggleHeading('h2')} className={`${blockType === "h2" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                <Heading2 className='size-5' />
            </button>
            <button onClick={() => toggleHeading('h3')} className={`${blockType === "h3" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                <Heading3 className='size-5' />
            </button>

            <button onClick={() => toggleHeading('paragraph')} className={` ${blockType === "paragraph" ? 'bg-slate-200' : ''} cursor-pointer px-2 hover:bg-gray-300 border-0 rounded-sm font-semibold h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                p
            </button>
            <div className="border-l-2 h-6 border-slate-300"></div>
            <button onClick={() => toggleTextFormat('bold')} className={` ${textFormat === 'bold' && 'bg-slate-200'} cursor-pointer px-2 hover:bg-gray-300 border-0 rounded-sm font-bold h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                B
            </button>
            <button onClick={() => toggleTextFormat('italic')} className={` ${textFormat === 'italic' && 'bg-slate-200'} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <Italic className='size-4.5' />
            </button>

            <div className="border-l-2 h-6 border-slate-300"></div>
            <button onClick={() => toggleTextAlign('left')} className={`${textAlign === "left" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <TextAlignStart className='size-4.5' />
            </button>
            <button onClick={() => toggleTextAlign('justify')} className={` ${textAlign === "justify" ? 'bg-slate-200' : ''}cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <TextAlignJustify className='size-4.5' />
            </button>
            <button onClick={() => toggleTextAlign('center')} className={`${textAlign === "center" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <TextAlignCenter className='size-4.5' />
            </button>
            <button onClick={() => toggleTextAlign('right')} className={`${textAlign === "right" ? 'bg-slate-200' : ''} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <TextAlignEnd className='size-4.5' />
            </button>

            <div className="border-l-2 h-6 border-gray-300"></div>
            <button onClick={() => toggleList('ol')} className={` ${listType === 'ol' && 'bg-gray-200'} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <ListOrdered className='size-4.5' />
            </button>
            <button onClick={() => toggleList('ul')} className={`${listType === 'ul' && 'bg-gray-200'} cursor-pointer p-0.5 hover:bg-gray-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900`}>
                <List className='size-4.5' />
            </button>

        </div>
    );
}


function onError(error) {
    console.error(error);
}

export default function Editor({ onChange, value, placeholder = "Napisz coś o sobie..." }) {

    const initialConfig = {
        namespace: 'MyEditor',
        theme: exampleTheme,
        onError,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode
        ]
    };


    return (
        <LexicalComposer initialConfig={initialConfig} >
            <div className="w-full relative">
                <Toolbar />
                <ListPlugin />
                <RichTextPlugin
                    placeholder={
                        <div className="text-gray-400 pointer-events-none w-full absolute top-10 left-[9px] font-extralight ">
                            <Placeholder placeholder={placeholder} />
                        </div>
                    }
                    contentEditable={
                        <ContentEditable
                            aria-label="Editor"
                            className="editor-input border border-t-0 min-h-36 rounded-b-sm border-gray-300 w-full text-base outline-none px-2 py-1"
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin
                    onChange={(editorState, editor) => {
                        editorState.read(() => {
                            const html = $generateHtmlFromNodes(editor);
                            onChange(html);
                        });
                    }}
                />
            </div>
            <HistoryPlugin />
            <AutoFocusPlugin />
        </LexicalComposer>
    );
}


function Placeholder({ placeholder }) {
    return (
        <div className="absolute pointer-events-none select-none">
            {placeholder}
        </div>
    )
}

const exampleTheme = {
    paragraph: 'text-md',
    quote: 'editor-quote',
    heading: {
        h1: 'text-3xl my-2',
        h2: 'text-2xl my-2',
        h3: 'text-xl my-2',
    },
    list: {
        nested: {
            listitem: 'ml-6',
        },
        ol: 'list-decimal ml-6 my-1',
        ul: 'list-disc ml-6 my-1',
        listitem: 'my-0.5',
        listitemChecked: 'line-through opacity-70',
        listitemUnchecked: '',
    },

};