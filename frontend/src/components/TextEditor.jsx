import { $getRoot, $getSelection } from 'lexical';
import { useEffect, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {

    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    SELECTION_CHANGE_COMMAND
} from 'lexical';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
} from "@lexical/list";

import { Heading1, Heading2, Heading3, Italic, List, ListOrdered, Redo, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart, Undo } from 'lucide-react';



function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [blockType, setBlockType] = useState('paragraph');
    const [textAlign, setTextAlign] = useState('left');

    const toggleBold = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    };

    const toggleItalic = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    };

    const toggleHeader1 = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'h1');
    }

    const toggleHeader2 = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'h2');
    }

    const toggleHeader3 = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'h');
    }

    const insertOrderedList = () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    };

    const insertUnorderedList = () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    };

    const removeList = () => {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    };

    const setAlign = (align) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
    };



    return (
        <div className="flex items-center justify-items-start border-2 border-slate-300 rounded-t-sm w-full py-1 gap-1 text-slate-700 ">
            <button onClick={toggleBold} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-8 flex items-center justify-center ml-1 hover:text-slate-900'>
                <Undo className="size-6 " />
            </button>
            <button onClick={toggleBold} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-8 flex items-center justify-center hover:text-slate-900'>
                <Redo className='size-6 ' />
            </button>
            <div className="border-l-2 h-6 border-slate-300"></div>
            <button onClick={toggleHeader1} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <Heading1 className='size-5' />
            </button>
            <button onClick={toggleHeader2} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <Heading2 className='size-5' />
            </button>
            <button onClick={toggleHeader3} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <Heading3 className='size-5' />
            </button>
            <div className="border-l-2 h-6 border-slate-300"></div>
            <button aria-pressed={isBold} onClick={toggleBold} className={`cursor-pointer px-2 hover:bg-slate-300 border-0 rounded-sm font-bold h-6 w-6 flex items-center justify-center hover:text-slate-900 `}>
                B
            </button>
            <button onClick={toggleItalic} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <Italic className='size-4.5' />
            </button>

            <div className="border-l-2 h-6 border-slate-300"></div>
            <button onClick={toggleItalic} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <TextAlignStart className='size-4.5' />
            </button>
            <button onClick={toggleItalic} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <TextAlignJustify className='size-4.5' />
            </button>
            <button onClick={toggleItalic} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <TextAlignCenter className='size-4.5' />
            </button>
            <button onClick={toggleItalic} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <TextAlignEnd className='size-4.5' />
            </button>

            <div className="border-l-2 h-6 border-slate-300"></div>
            <button onClick={insertOrderedList} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <ListOrdered className='size-4.5' />
            </button>
            <button onClick={insertUnorderedList} className='cursor-pointer p-0.5 hover:bg-slate-300 border-0 rounded-sm h-6 w-6 flex items-center justify-center hover:text-slate-900'>
                <List className='size-4.5' />
            </button>

        </div>
    );
}


function onError(error) {
    console.error(error);
}

export default function Editor() {

    const initialConfig = {
        namespace: 'MyEditor',
        theme: exampleTheme,
        onError,
    };


    return (
        <LexicalComposer initialConfig={initialConfig} >
            <div className="w-full">
                <Toolbar />
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            aria-label="Editor"
                            className="editor-input border-2 border-t-0 min-h-36 rounded-b-sm border-slate-300 w-full text-base outline-none px-2 py-1"
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <HistoryPlugin />
            <AutoFocusPlugin />
        </LexicalComposer>
    );
}


const exampleTheme = {
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
        h6: 'editor-heading-h6',
    },
    list: {
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listItem',
        listitemChecked: 'editor-listItemChecked',
        listitemUnchecked: 'editor-listItemUnchecked',
    },
    hashtag: 'editor-hashtag',
    image: 'editor-image',
    link: 'editor-link',
    text: {
        bold: 'editor-textBold',
        code: 'editor-textCode',
        italic: 'editor-textItalic',
        strikethrough: 'editor-textStrikethrough',
        subscript: 'editor-textSubscript',
        superscript: 'editor-textSuperscript',
        underline: 'editor-textUnderline',
        underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
    code: 'editor-code',
    codeHighlight: {
        atrule: 'editor-tokenAttr',
        attr: 'editor-tokenAttr',
        boolean: 'editor-tokenProperty',
        builtin: 'editor-tokenSelector',
        cdata: 'editor-tokenComment',
        char: 'editor-tokenSelector',
        class: 'editor-tokenFunction',
        'class-name': 'editor-tokenFunction',
        comment: 'editor-tokenComment',
        constant: 'editor-tokenProperty',
        deleted: 'editor-tokenProperty',
        doctype: 'editor-tokenComment',
        entity: 'editor-tokenOperator',
        function: 'editor-tokenFunction',
        important: 'editor-tokenVariable',
        inserted: 'editor-tokenSelector',
        keyword: 'editor-tokenAttr',
        namespace: 'editor-tokenVariable',
        number: 'editor-tokenProperty',
        operator: 'editor-tokenOperator',
        prolog: 'editor-tokenComment',
        property: 'editor-tokenProperty',
        punctuation: 'editor-tokenPunctuation',
        regex: 'editor-tokenVariable',
        selector: 'editor-tokenSelector',
        string: 'editor-tokenSelector',
        symbol: 'editor-tokenProperty',
        tag: 'editor-tokenProperty',
        url: 'editor-tokenOperator',
        variable: 'editor-tokenVariable',
    },
};