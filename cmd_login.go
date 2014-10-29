package main

import (
	"github.com/codegangsta/cli"
	"github.com/keybase/go-libkb"
)

type CmdLogin struct{}

func (v *CmdLogin) Run() error {
	return libkb.G.LoginState.Login()
}

func NewCmdLogin(cl *CommandLine) cli.Command {
	return cli.Command{
		Name: "login",
		Usage: "Establish a session with the keybase server " +
			"(if necessary)",
		Action: func(c *cli.Context) {
			cl.ChooseCommand(&CmdLogin{}, "login", c)
		},
	}
}

func (v *CmdLogin) UseConfig() bool   { return true }
func (v *CmdLogin) UseKeyring() bool  { return true }
func (v *CmdLogin) UseAPI() bool      { return true }
func (v *CmdLogin) UseTerminal() bool { return true }

func (c *CmdLogin) ParseArgv(*cli.Context) error { return nil }
