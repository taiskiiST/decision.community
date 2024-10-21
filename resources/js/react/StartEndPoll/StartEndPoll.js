import React from 'react';
import { client } from '../../shared/axios';
import { toast } from 'react-toastify';

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
                    dateStamp : ''
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
        var $date_start = 0;

        if (document.getElementById('date_start').value){
            $date_start = new Date(document.getElementById('date_start').value);
            $date_start = $date_start.getTime();
        }

        try {
            //await client.post(`/polls/${poll_full.id}/start`);

            await client.post(`/polls/${poll_full.id}/start/${$date_start}`);

            toast.success('Статус голосования успешно изменён.');

            window.location.reload();
        } catch (e) {
            toast.error('Ошибка изменения статуса голосования.');
        }
    }
    async togglePollEndState(e) {
        e.preventDefault();
        var $date_end = 0;

        if (document.getElementById('date_end').value){
            $date_end = new Date(document.getElementById('date_end').value);
            $date_end = $date_end.getTime();
        }
        //console.log('date_end - ', $date_end);
        try {
            //await client.post(`/polls/${poll_full.id}/end`);
            await client.post(`/polls/${poll_full.id}/end/${$date_end}`);

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
                <div className="flex flex-row px-4 items-center">
                    <div>
                        <label>
                            Установить дату начала (изменить/удалить дату начала)
                        </label>
                    </div>
                    <div>
                        <input type="datetime-local" id="date_start" defaultValue={poll_full.start ??  Date.now() } />
                    </div>
                    <div>
                        <button type="button"
                                //id="StartButton"
                                className="justify-end py-2 px-4 border border-transparent
                                text-sm font-medium text-white shadow-sm rounded-md bg-green-600
                                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-green-500"
                                onClick={this.togglePollStartState}>Установить</button>
                    </div>
                </div>
                <div className="flex flex-row px-4 items-center">
                    <div>
                        <label>Уставноить дату окончания (изменить/удалить дату окончания)</label>
                    </div>
                    <div>
                        <input type="datetime-local" id="date_end" defaultValue={poll_full.finished ??  Date.now() } />
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
