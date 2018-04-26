import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  posts: any = [];
  sentMessage = '';
  receivedMessage = '';
  messages = [];
  query: any;
  algo: string;
  showSpinner = false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  initChat(mensaje) {
    this.showSpinner = true;
    const msg = {'mensaje': mensaje};
    this.chatService.initChat(msg).subscribe(
      res => {
        this.showSpinner = false;
        this.query = res.query;
        this.algo = res.algo;
        this.receivedMessage = res.botMessage;
          this.messages.push({'sentBy': 'user', 'content': this.sentMessage},
            {'sentBy': 'bot', 'content': this.receivedMessage});
      }
    );
  }

}
