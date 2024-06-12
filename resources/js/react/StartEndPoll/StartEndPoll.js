import React from 'react';
import { client } from '../../shared/axios';
import { toast } from 'react-toastify';
import {convertFromRaw, EditorState} from "draft-js";

const {
    poll_full,
} = window.TSN || {};

class StartEndPoll extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            startVariable: [
                {
                    num : 1,
                    title : 'Запланировать начало',
                    dateStamp : null
                },
                {
                    num : 2,
                    title : 'Установить дату начала (изменить/удалить дату начала)',
                    dateStamp : poll_full.start ??  Date.now()
                }
            ],
        };

        this.handleStart = this.handleStart.bind(this);
    }
    handleStart = (e) => {
        const strVar = this.state.startVariable.map((strVar)=>{
            if (strVar.num = e.target.value){
                return strVar;
            }
        })
        document.getElementById('StartButton').innerText = strVar.title + strVar.dateStamp
    }
    async togglePollStartState(e) {
        e.preventDefault();
        try {
            await client.post(`/polls/${poll_full.id}/start`);

            toast.success('Статус голосования успешно изменён.');

            window.location.reload();
        } catch (e) {
            toast.error('Ошибка изменения статуса голосования.');
        }
    }
    async togglePollEndState(e) {
        e.preventDefault();
        try {
            await client.post(`/polls/${poll_full.id}/end`);

            toast.success('Статус голосования успешно изменён.');

            window.location.reload();
        } catch (e) {
            toast.error('Ошибка изменения статуса голосования.');
        }
    }

    render() {
        //console.log(poll);
        return (
            <div className="px-1 py-4 sm:px-6 ">
                <label className="px-1 py-4 block text-xl text-black font-semibold text-wrap">Начало и окончание</label>
                <div className="flex flex-row px-4">
                    Текущий статус:&nbsp;
                    {poll_full.start && poll_full.finished && <b> закончено в {`${poll_full.finished}`} </b> }

                    {poll_full.start && !poll_full.finished && <b> начато в {`${poll_full.start}`} </b> }

                    {!poll_full.start && !poll_full.finished && <b> не начато </b> }
                </div>
                <div className="flex flex-row px-4">
                    <div>
                        <select name="start_poll"
                                className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required onChange={this.handleStart} >
                            {this.state.startVariable.map( (strVar, key) => {
                                return <option key={key} value={strVar.num}>{strVar.title}</option>
                            } )}
                        </select>
                    </div>
                    <div>
                        <input type="datetime-local" defaultValue={poll_full.start ??  Date.now() } />
                    </div>
                    <div>
                        <button type="button"
                                id="StartButton"
                                className="justify-end py-2 px-4 border border-transparent
                                text-sm font-medium text-white shadow-sm rounded-md bg-green-600
                                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-green-500"
                                onClick={this.togglePollStartState}>Установить</button>
                    </div>
                </div>
                <div className="flex flex-row px-4">
                    <div>
                        <select name="end_poll"
                                className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required>
                            <option value="Запланировать окончание" defaultValue>Запланировать окончание</option>
                            <option value="Уставноить дату окончания (изменить/удалить дату окончания)">Уставноить дату окончания (изменить/удалить дату окончания)</option>
                        </select>
                    </div>
                    <div>
                        <input type="datetime-local" defaultValue={poll_full.finished ??  Date.now() } />
                    </div>
                    <div>
                        <button type="button"
                                className="justify-end py-2 px-4 border border-transparent
                                text-sm font-medium text-white shadow-sm rounded-md bg-green-600
                                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-green-500"
                        onClick={this.togglePollEndState}>Установить</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default StartEndPoll;
