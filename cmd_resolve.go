package main

import (
	"fmt"
	"github.com/codegangsta/cli"
	"github.com/keybase/go-libkb"
)

type CmdResolve struct {
	input string
}

func (v *CmdResolve) ParseArgv(ctx *cli.Context) error {
	nargs := len(ctx.Args())
	var err error
	if nargs == 1 {
		v.input = ctx.Args()[0]
	} else {
		err = fmt.Errorf("resolve takes one arg -- the name to resolve")
	}
	return err
}

func (v *CmdResolve) Run() error {
	res, err := libkb.ResolveUsername(v.input)
	if err == nil {
		fmt.Println(res)
	}
	return err
}

func NewCmdResolve(cl *CommandLine) cli.Command {
	return cli.Command{
		Name:  "resolve",
		Usage: "Resolve a foo@bar-style username to a keybase username",
		Action: func(c *cli.Context) {
			cl.ChooseCommand(&CmdResolve{}, "resolve", c)
		},
	}
}

func (v *CmdResolve) UseConfig() bool   { return true }
func (v *CmdResolve) UseKeyring() bool  { return false }
func (v *CmdResolve) UseAPI() bool      { return true }
func (v *CmdResolve) UseTerminal() bool { return false }
