/**
 *@class Common
 *
 */

Common = {}
	
Common.PLAT_CONFIG = {
    'pc99': ['-DTEMPLATE_BOARD=pc', '-DTEMPLATE_ARCH=x86_64'],
    'zynq7000': ['-DAARCH32=TRUE', '-DTEMPLATE_BOARD=zynq7000']
}

Common.CAMKES_VM_CONFIG  ={
    'pc99': ['-DTEMPLATE_BOARD=pc', '-DTEMPLATE_ARCH=x86_64', "-DFORCE_IOMMU=ON"]
}

Common.ALL_CONFIGS = Object.keys(Common.PLAT_CONFIG)

Common.TEMPLATES = {
    'hello-world': Common.ALL_CONFIGS,
    'ipc': Common.ALL_CONFIGS,
    'dynamic-1': Common.ALL_CONFIGS,
    'dynamic-2': Common.ALL_CONFIGS,
    'dynamic-3': Common.ALL_CONFIGS,
    'dynamic-4': Common.ALL_CONFIGS,
    'hello-camkes-0': Common.ALL_CONFIGS,
    'hello-camkes-1': Common.ALL_CONFIGS,
    'hello-camkes-2': Common.ALL_CONFIGS,
    'hello-camkes-timer': ['zynq7000'],
    'capabilities': Common.ALL_CONFIGS,
    'untyped': Common.ALL_CONFIGS,
    'mapping': ['pc99'],
    'camkes-vm-linux': ['pc99'],
    'camkes-vm-crossvm': ['pc99'],
    'threads': Common.ALL_CONFIGS,
    'notifications': ['pc99'],
    'mcs': Common.ALL_CONFIGS,
    'interrupts': ['zynq7000'],
    'fault-handlers': Common.ALL_CONFIGS,
}


Common.ALL_TEMPLATES = Object.keys(Common.TEMPLATES)

Common.get_template_dir = async () => {
  return __dirname	
}

Common.init_build_directory = async (platform, template, initialized, templatedir, builddir, config_dict=Common.PLAT_CONFIG)  => {
	const {cmake} = require('nodejs-sh'),
	      cwd = process.cwd(),
	      path = require('path')	

	var execSh = require("exec-sh"),
	    result,
	    output
	
	process.chdir(builddir)
	if(!initialized){
	  template_dir =  "-DTEMPLATE_DIR=" + path.basename(templatedir)
	  args = ['-DCMAKE_TOOLCHAIN_FILE=../kernel/gcc.cmake', '-G', 'Ninja', config_dict[platform].join(' '), template_dir, '..'].join(' ') 
	  try{
	    execSh('cmake ' + args, {cwd: builddir}, function(err){
		if(err){ 
		  console.log(err)		
		}
		else{
	          execSh('cmake ' + '..', {cwd: builddir}, function(err){
		    if(err){ 
		      console.log(err)		
		    }
		    else{
			
		    }
		  });
		}
	    });
	  }
	  catch(exitCode){
	    if(exitCode != 0)
	       return result		
	  }
	}
	else {
	  execSh('cmake ' + '..', {cwd: builddir}, function(err){
	    if(err){ 
	      console.log(err)		
	    }
	    else{
	
	    }
	  });
	}

}

Common.init_template_directory = async (platform, template, templatedir) => {
	arch = (platform === "pc99")? "x86_64": "aarch32"
	const fs = require('fs'),
	path = require('path');
	let task,
	solution;

	try {
	fs.writeFileSync(path.join(templatedir, '.template_config'),
	     "set(TEMPLATE_COMMAND \"" + [ "PYTHONPATH=${PYTHON_CAPDL_PATH}",
	    "python", path.join(__dirname, "template.py"),
	    //path.join(__dirname, "bin/template"), path.join(__dirname, "template.js"),
	     "--template-file", path.join(__dirname, "templates/"+template+"/"+template),
	     "--out-dir", "${output_dir}",
	     "--input-files", "${input_files}",
             "--output-files", "${output_files}",
             "--arch", arch,
             (template === "mcs")?"--rt" + template: "",
             (task)?"--task;" + task:"",
             (solution)?"--solution" + solution:""
	    ].join(';')+ "\")"
		
		,function(err) {
	  if(err) {
	    return console.log(err);
	  }
          console.log("Generated .template_config");
	}); 
	} 
	catch(err){
		console.log('init_template_directory: ', err.message) 
	}
	return
}

Common.init_directories = async (platform, template, initialized, templatedir, builddir)  => {
	 const {cmake} = require('nodejs-sh')
	 let output,
    	 config_dict = (template === 'camkes-vm')?Common.CAMKES_VM_CONFIG:Common.PLAT_CONFIG;
	 try{
	   process.chdir(templatedir)
	   let output1 = await Common.init_template_directory(platform, template, templatedir)
	   console.log(process.cwd())		 
	   process.chdir(builddir)
	   console.log(process.cwd())		 
	   let output2 = await Common.init_build_directory(platform, template, initialized, templatedir, builddir, config_dict)
	   console.log(output2)
	   console.log(process.cwd())		 
	   return output2
	   
	   		   
	   //output = await cmake('..').toString()
	 }
         catch (exitCode) {
	   console.log(exitCode)
	 }

}




module.exports = Common
