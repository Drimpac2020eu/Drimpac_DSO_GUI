#!/bin/bash

process=$(ps aux|egrep '[0-9] node.*www'|head -n1|cut -d ' ' -f2)
kill -9 $process
rm nohup.out
nohup npm start &
